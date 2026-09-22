import React from 'react';
import { Heart, Sparkles, Check, Coffee } from 'lucide-react';

interface TipCalculatorProps {
  orderTotal: number;
  selectedTipPercent: number | null;
  onSelectTipPercent: (percent: number | null) => void;
  className?: string;
}

export const TipCalculator: React.FC<TipCalculatorProps> = ({
  orderTotal,
  selectedTipPercent,
  onSelectTipPercent,
  className = '',
}) => {
  const tipOptions = [10, 15, 20];

  const calculateTipAmount = (percent: number) => {
    return (orderTotal * percent) / 100;
  };

  const activeTipAmount = selectedTipPercent ? calculateTipAmount(selectedTipPercent) : 0;
  const totalWithTip = orderTotal + activeTipAmount;

  return (
    <div
      id="tip-calculator-container"
      className={`bg-[#FBF7F1] border border-[#EFE7DE] rounded-xl p-3.5 space-y-3 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FBF0EB] text-[#B85D36] flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 fill-[#B85D36]/20" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3D2314] tracking-wide">
              Calculadora de propinas sugeridas
            </h5>
            <p className="text-[11px] text-ink-secondary">
              Agradecimiento voluntario para el barista y equipo
            </p>
          </div>
        </div>

        {selectedTipPercent !== null && (
          <button
            type="button"
            onClick={() => onSelectTipPercent(null)}
            className="text-[11px] text-ink-secondary hover:text-[#B85D36] underline cursor-pointer transition-colors"
          >
            Quitar
          </button>
        )}
      </div>

      {/* Buttons Grid for 10%, 15%, 20% */}
      <div className="grid grid-cols-3 gap-2">
        {tipOptions.map((percent) => {
          const isSelected = selectedTipPercent === percent;
          const tipAmount = calculateTipAmount(percent);
          const formattedTip = tipAmount % 1 === 0 ? tipAmount.toFixed(0) : tipAmount.toFixed(2);

          return (
            <button
              key={percent}
              type="button"
              id={`tip-option-${percent}-btn`}
              onClick={() => {
                if (isSelected) {
                  onSelectTipPercent(null); // Click again to deselect
                } else {
                  onSelectTipPercent(percent);
                }
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                isSelected
                  ? 'border-[#B85D36] bg-[#3D2314] text-white ring-1 ring-[#B85D36]'
                  : 'border-[#EFE7DE] bg-[#FBF7F1] text-ink-secondary hover:bg-[#F9F5F0] hover:border-[#D4C3B3]'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="font-serif text-sm font-bold">{percent}%</span>
                {isSelected && <Check className="w-3 h-3 text-[#E9BDA7]" />}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isSelected ? 'text-[#EFE7DE]' : 'text-[#B85D36]'
                }`}
              >
                +${formattedTip}
              </span>
            </button>
          );
        })}
      </div>

      {/* Calculated Breakdown Feedback */}
      {selectedTipPercent !== null && (
        <div className="bg-[#FBF7F1]/90 border border-[#EFE7DE] rounded-lg p-2.5 text-xs text-ink-secondary space-y-1 animate-in fade-in duration-200">
          <div className="flex justify-between items-center text-[11px] text-ink-secondary">
            <span>Subtotal pedido:</span>
            <span>${orderTotal.toFixed(2)} MXN</span>
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#B85D36] font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Propina sugerida ({selectedTipPercent}%):
            </span>
            <span>+${activeTipAmount.toFixed(2)} MXN</span>
          </div>
          <div className="border-t border-[#EFE7DE] pt-1 flex justify-between items-center font-bold text-[#3D2314] text-xs">
            <span>Total con propina:</span>
            <span className="font-serif text-sm text-[#3D2314]">
              ${totalWithTip.toFixed(2)} MXN
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
