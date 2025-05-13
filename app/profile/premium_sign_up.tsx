import React, { useState } from 'react';
import { useTheme, Text, Button, PressableButton } from 'hyper-native-ui';
import { fetchPaymentSheetParams, fetchPaymentSheetSuccess } from "@/redux-stores/slice/account/api.service";
import { useStripe } from "@stripe/stripe-react-native";
import { SafeAreaView, ToastAndroid } from "react-native";
import { View, ScrollView } from 'react-native';
import { PremiumSignUpPlan } from '@/types';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '@/components/AppHeader';

export default function PremiumSignUpScreen() {
	const navigation = useNavigation();
	const [selectedPlan, setSelectedPlan] = useState('Premium');
	const [billingCycle, setBillingCycle] = useState<"Annual" | "Monthly">('Annual');
	const { currentTheme } = useTheme();
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const [loading, setLoading] = useState(false);
	const plans = billingCycle === 'Annual' ? AnnualPlans : MonthlyPlans;

	const initializePaymentSheet = async ({
		mainPrice
	}: PremiumSignUpPlan) => {
		const {
			paymentIntent,
			ephemeralKey,
			customer,
		} = await fetchPaymentSheetParams({ mainPrice: mainPrice });
		setLoading(true);
		if (!paymentIntent || !ephemeralKey || !customer) return;

		const { error } = await initPaymentSheet({
			// subscription details
			merchantDisplayName: "Akash Mondal",
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
			allowsDelayedPaymentMethods: true,
			defaultBillingDetails: {
				name: 'Jane Doe',
			},
		});

		if (!error) {
			setLoading(true);
		}
	};

	const openPaymentSheet = async () => {
		const selectedPlanDetails = plans.find(plan => plan.title === selectedPlan);
		if (!selectedPlanDetails) return;
		await initializePaymentSheet(selectedPlanDetails);
		const { error } = await presentPaymentSheet();
		setLoading(false);
		if (!error) {
			///* Handle successful payment here */
			await fetchPaymentSheetSuccess(selectedPlanDetails);
			ToastAndroid.show("Now you are a premium user", ToastAndroid.LONG);
			// Payment successful, navigate to the previous screen or show a success message
			navigation.canGoBack() && navigation.goBack();
		};
	};

	return (
		<>
			<AppHeader title="Premium" key={"profile-premium"} />
			<ScrollView style={{paddingHorizontal:20}}>
				<SafeAreaView>
					<Text
						style={{
							fontSize: 28,
							fontWeight: 'bold',
							textAlign: 'center',
							marginVertical: 16,
						}}
					>
						Upgrade to Premium
					</Text>
					<Text
						variantColor="secondary"
						style={{
							fontSize: 14,
							textAlign: 'center',
							marginBottom: 20,
						}}
					>
						Enjoy an enhanced experience, exclusive creator tools, top-tier verification and security.
					</Text>

					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							marginBottom: 20,
							gap: 12
						}}
					>
						<Button
							disabled={billingCycle === 'Annual'}
							variant={billingCycle === "Annual" ? 'default' : 'outline'}
							activeOpacity={0.8}
							style={{
								borderRadius: 20,
							}}
							onPress={() => setBillingCycle('Annual')}
						>
							Annual
						</Button>
						<Button
							variant={billingCycle === 'Monthly' ? 'default' : 'outline'}
							disabled={billingCycle === 'Monthly'}
							activeOpacity={0.8}
							style={{
								borderRadius: 20,
							}}
							onPress={() => setBillingCycle('Monthly')}
						>
							Monthly
						</Button>
					</View>

					<View style={{ gap: 20 }}>
						{plans.map((plan) => (
							<PressableButton
								// activeOpacity={0.8}
								key={plan.title}
								style={{
									// backgroundColor: currentTheme.input,
									borderColor: selectedPlan === plan.title ? currentTheme.primary : currentTheme.border,
									borderWidth: selectedPlan === plan.title ? 2 : 2,
									borderRadius: 20,
									padding: 16,
									width: '100%',
								}}
								onPress={() => setSelectedPlan(plan.title)}
							>
								<Text style={{ fontSize: 18, fontWeight: 'bold' }}>
									{plan.title}
								</Text>
								<Text style={{ fontSize: 16, color: currentTheme.primary, marginTop: 5 }}>
									{plan.price} / month
								</Text>
								<Text style={{ fontSize: 12, color: currentTheme.muted_foreground, marginBottom: 10 }}>

									{plan.yearlyPrice} billed annually{plan?.save ? ` • ${plan.save}` : ''}
								</Text>
								{plan.features.map((feature, index) => (
									<Text
										key={index}
										style={{
											fontSize: 14,
											// marginBottom: 4,
										}}
									>
										✓ {feature}
									</Text>
								))}
							</PressableButton>
						))}
					</View>

					<Button
						disabled={loading}
						onPress={openPaymentSheet}
						variant={"default"}
						activeOpacity={0.8}
						style={{
							paddingVertical: 2,
							borderRadius: 30,
							marginTop: 30,
						}}
					>
						Subscribe & Pay
					</Button>
					<View style={{ height: 30 }} />
				</SafeAreaView>
			</ScrollView>
		</>
	);
}


const AnnualPlans = [
	{
		title: 'Basic',
		price: '₹215.87',
		mainPrice: 21587,
		yearlyPrice: '₹2,590.48',
		save: 'SAVE 11%',
		features: [
			'Small reply boost',
			'Encrypted direct messages',
			'Bookmark folders',
			'Highlights tab',
			'Edit post',
			'Longer posts',
		],
	},
	{
		title: 'Premium',
		price: '₹566.67',
		mainPrice: 56667,
		yearlyPrice: '₹6,800',
		save: 'SAVE 12%',
		features: [
			'Everything in Basic, and',
			'Half Ads in For You and Following',
			'Larger reply boost',
			'Get paid to post',
			'Checkmark',
			'Gemini with increased limits',
			'Snaapio Pro, Analytics, Media Studio',
			'Creator Subscriptions',
		],
	},
	{
		title: 'Premium+',
		price: '₹2,861.67',
		mainPrice: 286167,
		yearlyPrice: '₹34,340',
		save: 'SAVE 17%',
		features: [
			'Everything in Premium, and',
			'Fully ad-free',
			'Largest reply boost',
			'Write Articles',
			'Radar',
			'Gemini AI',
			'Highest usage limits',
			'Unlock DeepSearch & Think',
			'Early access to new features',
		],
	},
];

const MonthlyPlans = [
	{
		title: 'Basic',
		price: '₹243.75',
		mainPrice: 24375,
		yearlyPrice: 'Billed monthly',
		save: undefined,
		features: [
			'Small reply boost',
			'Encrypted direct messages',
			'Bookmark folders',
			'Highlights tab',
			'Edit post',
			'Longer posts',
		],
	},
	{
		title: 'Premium',
		price: '₹650',
		mainPrice: 65000,
		yearlyPrice: 'Billed monthly',
		save: undefined,
		features: [
			'Everything in Basic, and',
			'Half Ads in For You and Following',
			'Larger reply boost',
			'Get paid to post',
			'Checkmark',
			'Gemini with increased limits',
			'Snaapio Pro, Analytics, Media Studio',
			'Creator Subscriptions',
		],
	},
	{
		title: 'Premium+',
		price: '₹3,470',
		mainPrice: 347000,
		yearlyPrice: 'Billed monthly',
		save: undefined,
		features: [
			'Everything in Premium, and',
			'Fully ad-free',
			'Largest reply boost',
			'Write Articles',
			'Radar',
			'Gemini AI',
			'Highest usage limits',
			'Unlock DeepSearch & Think',
			'Early access to new features',
		],
	},
];