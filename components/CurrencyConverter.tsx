'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

interface CurrencyConverterProps {
  usdAmount: number;
  onCurrencyChange?: (convertedAmount: number, currency: string) => void;
}

const popularCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
];

const CurrencyConverter = ({ usdAmount, onCurrencyChange }: CurrencyConverterProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(usdAmount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const convertCurrency = async (currency: string) => {
    if (currency === 'USD') {
      setConvertedAmount(usdAmount);
      onCurrencyChange?.(usdAmount, 'USD');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/currency/convert?amount=${usdAmount}&to=${currency}`);
      const data = await response.json();

      if (data.success) {
        setConvertedAmount(data.data.convertedAmount);
        onCurrencyChange?.(data.data.convertedAmount, currency);
      } else {
        setError('Failed to convert currency');
        setConvertedAmount(usdAmount);
        onCurrencyChange?.(usdAmount, 'USD');
      }
    } catch (err) {
      setError('Failed to convert currency');
      setConvertedAmount(usdAmount);
      onCurrencyChange?.(usdAmount, 'USD');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    convertCurrency(currency);
  };

  useEffect(() => {
    convertCurrency(selectedCurrency);
  }, [usdAmount]);

  const selectedCurrencyInfo = popularCurrencies.find(c => c.code === selectedCurrency);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-blue-900">Currency Converter</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-800 mb-1">
            Select your currency:
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            {popularCurrencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.name} ({currency.code})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-200">
          <div>
            <div className="text-sm text-gray-600">Price in your currency:</div>
            <div className="text-lg font-bold text-blue-900">
              {loading ? (
                <span className="animate-pulse">Converting...</span>
              ) : error ? (
                <span className="text-red-600">Error</span>
              ) : (
                `${selectedCurrencyInfo?.symbol}${convertedAmount.toFixed(2)}`
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Original (USD)</div>
            <div className="text-sm text-gray-700">${usdAmount.toFixed(2)}</div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}. Showing USD price.
          </div>
        )}

        <div className="text-xs text-blue-600">
          * All transactions are processed in USD. This converter is for reference only.
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
