import { StripeProvider } from '@stripe/stripe-react-native';
import { ReactNode } from 'react';

function StripProvider({ children }: { children: ReactNode }) {

	return (
		<StripeProvider
			publishableKey={"pk_test_51Nn5mUSH7JDxRBrAzO2zTdzZU0Vy2NFKoCUpF9SyOD5Gse0C9wJI1EOHyHy1NBcq8i2vDc2dc4bmxUm5S2EBcObM001y0VfoyR"}
			// merchantIdentifier="merchant.identifier" // required for Apple Pay
			urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
		>
			<>
				{children}
			</>
		</StripeProvider>
	);
}

export default StripProvider;