import { useEffect, useState } from 'react';

function usePricingCalculator(finalPrice, discountPercent) {
	const [price, setPrice] = useState({});
	useEffect(() => {
		let basePrice = (finalPrice * 100 * 100) / (118 * (100 - discountPercent));
		let discountValue = (discountPercent / 100) * basePrice;
		let taxableValue = basePrice - discountValue;
		let taxValue = taxableValue * 0.18;
		taxableValue = taxableValue.toFixed(2);
		basePrice = basePrice.toFixed(2);
		discountValue = discountValue.toFixed(2);
		taxValue = taxValue.toFixed(2);

		setPrice(p => {
			return {
				...p,
				basePrice,
				taxableValue,
				discountValue,
				taxValue,
			};
		});
	}, [finalPrice, discountPercent]);
	return price;
}

export default usePricingCalculator;
