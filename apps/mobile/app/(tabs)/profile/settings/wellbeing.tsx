import { ScrollView, Text, StyleSheet } from 'react-native';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { APP_FONTS } from '../../../../styles/AppFonts';

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();

	return (
		<AppTopNavbar
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			title={'Wellbeing Settings'}
			translateY={translateY}
		>
			<ScrollView>
				<Text style={[styles.text, { color: theme.secondary.a20 }]}>
					More settings coming{' '}
					<Text style={{ color: theme.complementary.a0 }}>soon™</Text>
				</Text>
			</ScrollView>
		</AppTopNavbar>
	);
}

export default Page;

const styles = StyleSheet.create({
	text: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		marginTop: '50%',
		fontSize: 18,
		textAlign: 'center',
	},
});
