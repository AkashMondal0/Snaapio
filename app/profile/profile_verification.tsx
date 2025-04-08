import { configs } from "@/configs";
import { useStripe } from "@stripe/stripe-react-native";
import { Button, Text } from "hyper-native-ui";
import { useState } from "react";
import { Alert, SafeAreaView } from "react-native";


function AccountVerificationScreen() {
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const [loading, setLoading] = useState(false);

	const fetchPaymentSheetParams = async () => {
		const response = await fetch(`${configs.serverApi.baseUrl}/payment/sheet`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({}),
		});

		if (!response.ok) {
			console.error("Failed to fetch payment sheet params", response.status);
			throw new Error("Failed to fetch payment sheet params");
		}

		const data = await response.json();
		console.error("Fetched payment sheet params:", data);

		return {
			paymentIntent: data.paymentIntent,
			ephemeralKey: data.ephemeralKey,
			customer: data.customer,
		};
	};
	const initializePaymentSheet = async () => {
		const {
			paymentIntent,
			ephemeralKey,
			customer,
		} = await fetchPaymentSheetParams();

		if (!paymentIntent || !ephemeralKey || !customer) return;

		const { error } = await initPaymentSheet({
			merchantDisplayName: "Jane Doe",
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
			// Set `allowsDelayedPaymentMethods` to true if your business can handle payment
			//methods that complete payment after a delay, like SEPA Debit and Sofort.
			allowsDelayedPaymentMethods: true,
			defaultBillingDetails: {
				name: 'Jane Doe',
			}
		});

		if (!error) {
			setLoading(true);
		}
	};

	const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet();

		if (error) {
			Alert.alert(`Error code: ${error.code}`, error.message);
		} else {
			Alert.alert('Success', 'Your order is confirmed!');
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text style={{ fontSize: 20, marginBottom: 20 }}>Account Verification</Text>
			<Button
				variant='default'
				disabled={loading}
				onPress={async () => {
					try {
						await initializePaymentSheet();
						await openPaymentSheet();
					} catch (err) {
						console.error("Payment flow failed:", err);
					}
				}}>
				Checkout
			</Button>
		</SafeAreaView>
	);
}

export default AccountVerificationScreen