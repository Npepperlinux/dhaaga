import { memo } from 'react';
import { Text } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import { View } from 'react-native';
import { useTimelineController } from '../../../../states/useTimelineController';
import ControlSegment from '../components/ControlSegment';
import useTimelineOptions from '../states/useTimelineOptions';
import { AppInlineCheckbox } from '../../../lib/Checkboxes';

const UserTimelineController = memo(function Foo() {
	const { query } = useTimelineController();
	const {
		MediaOpt,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
		updateQuery,
		HideReply,
		HideReblog,
	} = useTimelineOptions();

	function onClickHideReply() {
		HideReply.current = !HideReply.current;
		updateQuery();
	}

	function onClickHideReblog() {
		HideReblog.current = !HideReblog.current;
		updateQuery();
	}

	return (
		<View>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					fontSize: 16,
				}}
			>
				User Timeline
			</Text>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_THEME.COLOR_SCHEME_D_NORMAL,
					fontSize: 14,
					opacity: 0.75,
				}}
			>
				{query?.label}
			</Text>

			<ControlSegment
				label={'More options:'}
				buttons={[
					{
						label: 'All',
						lookupId: 'all',
						onClick: onMediaOptAllSelected,
					},
					{
						label: 'Media Only',
						lookupId: 'media-only',
						onClick: () => {
							onMediaOptSelected(0);
						},
					},
				]}
				hash={State}
				selection={MediaOpt}
			/>

			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					marginTop: 16,
					marginBottom: 4,
				}}
			>
				More Filters
			</Text>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
				}}
			>
				<AppInlineCheckbox
					label={'Hide Reply'}
					checked={HideReply.current}
					onClick={onClickHideReply}
				/>
				<AppInlineCheckbox
					label={'Hide Reblog'}
					checked={HideReblog.current}
					onClick={onClickHideReblog}
				/>
			</View>
		</View>
	);
});

export default UserTimelineController;
