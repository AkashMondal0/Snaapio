import { configs } from '@/configs';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ReactNode } from 'react';

function StripProvider({ children }: { children: ReactNode }) {

	return (
		<StripeProvider
			publishableKey={configs.AppDetails.stripePk}
			// merchantIdentifier="merchant.identifier" // required for Apple Pay
			urlScheme="snaapio" // required for 3D Secure and bank redirects
		>
			<>
				{children}
			</>
		</StripeProvider>
	);
}

export default StripProvider;