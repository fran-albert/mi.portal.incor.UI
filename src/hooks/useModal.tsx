import { useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [extraData, setExtraData] = useState(null);

  const openModal = (data = null) => {
    setExtraData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setExtraData(null);
  };

  return { isOpen, openModal, closeModal, extraData };
};

export default useModal;
