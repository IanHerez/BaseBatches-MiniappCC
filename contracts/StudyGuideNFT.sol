// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StudyGuideNFT is ERC1155URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Estructura para almacenar información de la guía
    struct StudyGuide {
        uint256 id;
        string title;
        string author;
        string description;
        string subject;
        uint256 price;
        address creator;
        bool isAvailable;
        uint256 totalSupply;
        uint256 minted;
    }

    // Estructura para almacenar información de la compra
    struct Purchase {
        uint256 guideId;
        address buyer;
        address seller;
        uint256 amount;
        bool isDelivered;
        bool isCompleted;
        uint256 timestamp;
    }

    // Mapeos
    mapping(uint256 => StudyGuide) public studyGuides;
    mapping(uint256 => Purchase) public purchases; // purchaseId => Purchase
    mapping(uint256 => mapping(address => uint256)) public balances; // guideId => (address => amount)

    uint256 public guideCounter;
    uint256 public purchaseCounter;

    // Eventos
    event GuideCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        uint256 price
    );
    event GuideListed(
        uint256 indexed id,
        address indexed seller,
        uint256 price
    );
    event PurchaseInitiated(
        uint256 indexed purchaseId,
        uint256 indexed guideId,
        address indexed buyer,
        uint256 amount
    );
    event DeliveryConfirmed(
        uint256 indexed purchaseId,
        uint256 indexed guideId,
        address indexed buyer
    );
    event PurchaseCompleted(
        uint256 indexed purchaseId,
        uint256 indexed guideId,
        address indexed buyer,
        address seller
    );

    constructor() ERC1155("") Ownable(msg.sender) {}

    // Función para crear y listar una nueva guía
    function createGuide(
        string memory title,
        string memory author,
        string memory description,
        string memory subject,
        uint256 price,
        string memory uri
    ) external returns (uint256) {
        require(price > 0, "Price must be greater than 0");

        guideCounter++;
        uint256 newGuideId = guideCounter;

        studyGuides[newGuideId] = StudyGuide({
            id: newGuideId,
            title: title,
            author: author,
            description: description,
            subject: subject,
            price: price,
            creator: msg.sender,
            isAvailable: true,
            totalSupply: 1, // Cada guía es única (NFT)
            minted: 0
        });

        _setURI(newGuideId, uri);

        // Mintear el NFT al creador
        _mint(msg.sender, newGuideId, 1, "");
        studyGuides[newGuideId].minted++;

        emit GuideCreated(newGuideId, msg.sender, title, price);
        emit GuideListed(newGuideId, msg.sender, price);

        return newGuideId;
    }

    // Función para comprar una guía (inicia el proceso de escrow)
    function purchaseGuide(uint256 guideId) external payable nonReentrant {
        StudyGuide storage guide = studyGuides[guideId];
        require(guide.isAvailable, "Guide not available");
        require(msg.value >= guide.price, "Insufficient payment");
        require(
            balanceOf(guide.creator, guideId) > 0,
            "Guide not owned by seller"
        );

        purchaseCounter++;
        uint256 newPurchaseId = purchaseCounter;

        purchases[newPurchaseId] = Purchase({
            guideId: guideId,
            buyer: msg.sender,
            seller: guide.creator,
            amount: msg.value,
            isDelivered: false,
            isCompleted: false,
            timestamp: block.timestamp
        });

        emit PurchaseInitiated(newPurchaseId, guideId, msg.sender, msg.value);
    }

    // Función para confirmar la entrega (proof of delivery)
    function confirmDelivery(uint256 purchaseId) external {
        Purchase storage purchase = purchases[purchaseId];
        require(
            msg.sender == purchase.buyer,
            "Only buyer can confirm delivery"
        );
        require(!purchase.isDelivered, "Delivery already confirmed");
        require(!purchase.isCompleted, "Purchase already completed");

        purchase.isDelivered = true;

        // Transferir el NFT al comprador
        _safeTransferFrom(
            purchase.seller,
            purchase.buyer,
            purchase.guideId,
            1,
            ""
        );

        // Liberar el pago al vendedor
        payable(purchase.seller).transfer(purchase.amount);

        purchase.isCompleted = true;

        emit DeliveryConfirmed(purchaseId, purchase.guideId, purchase.buyer);
        emit PurchaseCompleted(
            purchaseId,
            purchase.guideId,
            purchase.buyer,
            purchase.seller
        );
    }

    // Función para obtener información de una compra
    function getPurchaseInfo(
        uint256 purchaseId
    )
        external
        view
        returns (
            uint256 guideId,
            address buyer,
            address seller,
            uint256 amount,
            bool isDelivered,
            bool isCompleted,
            uint256 timestamp
        )
    {
        Purchase storage purchase = purchases[purchaseId];
        return (
            purchase.guideId,
            purchase.buyer,
            purchase.seller,
            purchase.amount,
            purchase.isDelivered,
            purchase.isCompleted,
            purchase.timestamp
        );
    }

    // Función para obtener información de una guía
    function getGuideInfo(
        uint256 guideId
    )
        external
        view
        returns (
            string memory title,
            string memory author,
            string memory description,
            string memory subject,
            uint256 price,
            address creator,
            bool isAvailable,
            uint256 totalSupply,
            uint256 minted
        )
    {
        StudyGuide storage guide = studyGuides[guideId];
        return (
            guide.title,
            guide.author,
            guide.description,
            guide.subject,
            guide.price,
            guide.creator,
            guide.isAvailable,
            guide.totalSupply,
            guide.minted
        );
    }

    // Función para retirar fondos bloqueados (solo en caso de disputa)
    function withdrawFunds(uint256 purchaseId) external onlyOwner {
        Purchase storage purchase = purchases[purchaseId];
        require(!purchase.isCompleted, "Purchase already completed");
        require(
            block.timestamp > purchase.timestamp + 30 days,
            "Must wait 30 days"
        );

        // Devolver el dinero al comprador
        payable(purchase.buyer).transfer(purchase.amount);
        purchase.isCompleted = true;
    }
}
