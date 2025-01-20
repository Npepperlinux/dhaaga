import { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import AppNoAccount from '../../../components/error-screen/AppNoAccount';
import SocialHubPresenter from '../../../features/social-hub/presenters/SocialHubPresenter';
import SoftwareHeader from '../../../screens/accounts/fragments/SoftwareHeader';
import { Account } from '../../../database/_schema';
import {
	useAppAcct,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

type TimeOfDayGreetingProps = {
	acct: Account;
	noLogo?: boolean;
	style?: StyleProp<ViewStyle>;
};

type HubGreetingFragmentProps = {
	greeting: string;
	acct: Account;
	desc: string;
	driver: string;
	noLogo?: boolean;
};

function HubGreetingFragment({
	greeting,
	acct,
	noLogo,
}: HubGreetingFragmentProps) {
	const { theme } = useAppTheme();

	return (
		<View
			style={{
				flexDirection: 'row',
				position: 'relative',
			}}
		>
			<View style={{ flexGrow: 1 }}>
				<AppText.H6
					numberOfLines={1}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
					style={[{ maxWidth: '80%' }]}
				>
					{greeting}, {acct?.displayName}
				</AppText.H6>
				<AppText.Medium
					style={{
						color: theme.primary.a0,
						maxWidth: '80%',
					}}
					numberOfLines={1}
				>
					@{acct?.username}@{acct?.server}
				</AppText.Medium>
			</View>
			{!noLogo && (
				<View
					style={{
						position: 'absolute',
						right: 8,
						justifyContent: 'center',
						height: '100%',
						marginTop: 'auto',
					}}
				>
					<SoftwareHeader software={acct?.driver} iconSizeMultiplier={2.5} />
				</View>
			)}
		</View>
	);
}

export function TimeOfDayGreeting({
	acct,
	noLogo,
	style,
}: TimeOfDayGreetingProps) {
	const Component = useMemo(() => {
		const currentHours = new Date().getHours();
		let timeOfDay: TIME_OF_DAY;
		if (currentHours >= 21 || (currentHours >= 0 && currentHours < 6)) {
			timeOfDay = TIME_OF_DAY.NIGHT;
		} else if (currentHours >= 6 && currentHours < 12) {
			timeOfDay = TIME_OF_DAY.MORNING;
		} else if (currentHours >= 12 && currentHours < 17) {
			timeOfDay = TIME_OF_DAY.AFTERNOON;
		} else {
			timeOfDay = TIME_OF_DAY.EVENING;
		}

		switch (timeOfDay) {
			case TIME_OF_DAY.MORNING:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={`Good Morning`}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
			case TIME_OF_DAY.AFTERNOON:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={`Good Afternoon`}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
			case TIME_OF_DAY.EVENING:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={`Good Evening`}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
			case TIME_OF_DAY.NIGHT:
				return (
					<HubGreetingFragment
						acct={acct}
						driver={acct?.driver}
						greeting={`Good Night`}
						desc={`@${acct?.username}@${acct?.server}`}
						noLogo
					/>
				);
		}
	}, [acct]);

	return (
		<View
			style={[
				{
					paddingHorizontal: 8,
				},
				style,
			]}
		>
			{Component}
		</View>
	);
}

function Screen() {
	const { acct } = useAppAcct();

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.HOME} />;
	return <SocialHubPresenter />;
}

export default Screen;
