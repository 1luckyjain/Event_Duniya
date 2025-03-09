import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TicketSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketTiers: any[];
  onConfirm: (tierId: string, quantity: number) => void;
}

const TicketSelectionModal: React.FC<TicketSelectionModalProps> = ({
  isOpen,
  onClose,
  ticketTiers,
  onConfirm,
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  const selectedTierDetails = ticketTiers.find(tier => tier._id === selectedTier);

  const handleConfirm = () => {
    if (selectedTier && quantity > 0) {
      onConfirm(selectedTier, quantity);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Select Tickets</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {ticketTiers.map((tier) => (
            <label
              key={tier._id}
              className={`block p-4 rounded-lg cursor-pointer border ${
                selectedTier === tier._id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name="ticketTier"
                value={tier._id}
                checked={selectedTier === tier._id}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="hidden"
              />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{tier.name}</p>
                  <p className="text-sm text-gray-400">{tier.description}</p>
                </div>
                <p className="font-semibold">₹{tier.price}</p>
              </div>
            </label>
          ))}
        </div>

        {selectedTierDetails && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Quantity (max {selectedTierDetails.maxQuantity})
            </label>
            <input
              type="number"
              min="1"
              max={selectedTierDetails.maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!selectedTier || quantity < 1}
          className={`w-full py-3 rounded-lg font-medium ${
            selectedTier && quantity > 0
              ? 'bg-purple-500 hover:bg-purple-600'
              : 'bg-gray-700 cursor-not-allowed'
          }`}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default TicketSelectionModal;
