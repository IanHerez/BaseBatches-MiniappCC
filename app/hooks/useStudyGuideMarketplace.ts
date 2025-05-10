import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { STUDY_GUIDE_NFT_ADDRESS } from '../config/contracts';
import { STUDY_GUIDE_NFT_ABI } from '../config/abis';
import { useState } from 'react';

export const useStudyGuideMarketplace = () => {
  // Crear una nueva guía
  const { writeContract: createGuide, data: createGuideData } = useWriteContract();

  const { isLoading: isCreatingGuide } = useWaitForTransactionReceipt({
    hash: createGuideData,
  });

  // Comprar una guía
  const { writeContract: purchaseGuide, data: purchaseData } = useWriteContract();

  const { isLoading: isPurchasing } = useWaitForTransactionReceipt({
    hash: purchaseData,
  });

  // Confirmar entrega
  const { writeContract: confirmDelivery, data: confirmData } = useWriteContract();

  const { isLoading: isConfirmingDelivery } = useWaitForTransactionReceipt({
    hash: confirmData,
  });

  // Obtener información de la guía
  const { data: guideInfo } = useReadContract({
    address: STUDY_GUIDE_NFT_ADDRESS,
    abi: STUDY_GUIDE_NFT_ABI,
    functionName: 'getGuideInfo',
  });

  // Obtener información de la compra
  const { data: purchaseInfo } = useReadContract({
    address: STUDY_GUIDE_NFT_ADDRESS,
    abi: STUDY_GUIDE_NFT_ABI,
    functionName: 'getPurchaseInfo',
  });

  return {
    createGuide: async (guideData: {
      title: string;
      author: string;
      description: string;
      subject: string;
      price: string;
      uri: string;
    }) => {
      try {
        await createGuide({
          address: STUDY_GUIDE_NFT_ADDRESS,
          abi: STUDY_GUIDE_NFT_ABI,
          functionName: 'createGuide',
          args: [
            guideData.title,
            guideData.author,
            guideData.description,
            guideData.subject,
            parseEther(guideData.price),
            guideData.uri,
          ],
        });
      } catch (error) {
        console.error('Error creating guide:', error);
        throw error;
      }
    },

    purchaseGuide: async (guideId: number, price: string) => {
      try {
        await purchaseGuide({
          address: STUDY_GUIDE_NFT_ADDRESS,
          abi: STUDY_GUIDE_NFT_ABI,
          functionName: 'purchaseGuide',
          args: [guideId],
          value: parseEther(price),
        });
      } catch (error) {
        console.error('Error purchasing guide:', error);
        throw error;
      }
    },

    confirmDelivery: async (purchaseId: number) => {
      try {
        await confirmDelivery({
          address: STUDY_GUIDE_NFT_ADDRESS,
          abi: STUDY_GUIDE_NFT_ABI,
          functionName: 'confirmDelivery',
          args: [purchaseId],
        });
      } catch (error) {
        console.error('Error confirming delivery:', error);
        throw error;
      }
    },

    isCreatingGuide,
    isPurchasing,
    isConfirmingDelivery,
    guideInfo,
    purchaseInfo,
  };
};

const CreateGuideForm = () => {
  const { createGuide, isCreatingGuide } = useStudyGuideMarketplace();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    subject: '',
    price: '',
    uri: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGuide(formData);
      // Mostrar mensaje de éxito
    } catch (error) {
      // Manejar error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <button type="submit" disabled={isCreatingGuide}>
        {isCreatingGuide ? 'Publicando...' : 'Publicar Guía'}
      </button>
    </form>
  );
};

const GuideCard = ({ guideId, price }) => {
  const { purchaseGuide, isPurchasing } = useStudyGuideMarketplace();

  const handlePurchase = async () => {
    try {
      await purchaseGuide(guideId, price);
      // Mostrar mensaje de éxito
    } catch (error) {
      // Manejar error
    }
  };

  return (
    <div>
      {/* Información de la guía */}
      <button onClick={handlePurchase} disabled={isPurchasing}>
        {isPurchasing ? 'Procesando...' : 'Comprar Guía'}
      </button>
    </div>
  );
};

const DeliveryConfirmation = ({ purchaseId }) => {
  const { confirmDelivery, isConfirmingDelivery } = useStudyGuideMarketplace();
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    if (!image) return;
    
    try {
      // Aquí deberías subir la imagen a IPFS o similar
      const imageUri = await uploadToIPFS(image);
      
      // Confirmar la entrega
      await confirmDelivery(purchaseId);
      // Mostrar mensaje de éxito
    } catch (error) {
      // Manejar error
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <button onClick={handleConfirm} disabled={!image || isConfirmingDelivery}>
        {isConfirmingDelivery ? 'Confirmando...' : 'Confirmar Entrega'}
      </button>
    </div>
  );
}; 