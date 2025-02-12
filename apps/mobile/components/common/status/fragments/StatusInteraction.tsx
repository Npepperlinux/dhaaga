import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { StyleSheet, View } from 'react-native';
import PostStats from '../PostStats';
import PostActionButtonToggleBookmark from './modules/PostActionButtonToggleBookmark';
import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppPublishers,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { useAppStatusItem } from '../../../../hooks/ap-proto/useAppStatusItem';
import { AppToggleIcon } from '../../../lib/Icon';
import { appDimensions } from '../../../../styles/dimensions';
import ActivityPubService from '../../../../services/activitypub.service';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../states/_global';

/**
 * Press this to toggle sharing status
 */
function ShareButton() {
	const { dto: item } = useAppStatusItem();
	const [IsLoading, setIsLoading] = useState(false);
	const { postPub } = useAppPublishers();
	const { theme } = useAppTheme();
	const { driver } = useAppApiClient();

	async function onPress() {
		postPub.toggleShare(item.uuid, setIsLoading).finally(() => {
			Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		});
	}

	const FLAG = PostMiddleware.isShared(item);

	const canLike = ActivityPubService.canLike(driver);
	return (
		<AppToggleIcon
			flag={FLAG}
			activeIconId={'sync-outline'}
			inactiveIconId={'sync-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a20}
			size={appDimensions.timelines.actionButtonSize}
			style={[
				styles.actionButton,
				{
					paddingLeft: canLike ? 6 : 0,
				},
			]}
			onPress={onPress}
		/>
	);
}

/**
 * Press this to toggle like
 */
function LikeButton() {
	const { dto: item } = useAppStatusItem();
	const [IsLoading, setIsLoading] = useState(false);
	const { postPub } = useAppPublishers();
	const { theme } = useAppTheme();

	async function _toggleLike() {
		postPub.toggleLike(item.uuid, setIsLoading).finally(() => {
			Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		});
	}

	const FLAG = PostMiddleware.isLiked(item);

	return (
		<AppToggleIcon
			flag={FLAG}
			activeIconId={'heart'}
			inactiveIconId={'heart-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a20}
			size={appDimensions.timelines.actionButtonSize}
			style={[
				styles.actionButton,
				{
					marginLeft: -6,
				},
			]}
			onPress={_toggleLike}
		/>
	);
}

/**
 * Press this to open composer (reply mode)
 */
function CommentButton() {
	const { dto: item } = useAppStatusItem();
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();

	function onPress() {
		setCtx({ uuid: item.uuid });
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	return (
		<AppToggleIcon
			flag={false}
			activeIconId={'chatbox-outline'}
			inactiveIconId={'chatbox-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a20}
			size={appDimensions.timelines.actionButtonSize}
			style={styles.actionButton}
			onPress={onPress}
		/>
	);
}

function ReactButton() {
	const { dto: item } = useAppStatusItem();
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();

	function onPress() {
		setCtx({ uuid: item.uuid });
		show(APP_BOTTOM_SHEET_ENUM.ADD_REACTION, true);
	}

	return (
		<AppToggleIcon
			flag={false}
			activeIconId={'smiley'}
			inactiveIconId={'smiley-outline'}
			activeTint={theme.primary.a0}
			inactiveTint={theme.secondary.a20}
			size={appDimensions.timelines.actionButtonSize}
			style={styles.actionButton}
			onPress={onPress}
		/>
	);
}

function StatusInteractionButtons() {
	const { acct } = useAppAcct();
	const IS_MISSKEY = ActivityPubService.misskeyLike(acct.driver);

	return (
		<View style={styles.interactionButtonSection}>
			<View style={{ flexDirection: 'row' }}>
				{!IS_MISSKEY && <LikeButton />}
				<ShareButton />
				<CommentButton />
				{IS_MISSKEY && <ReactButton />}
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<PostActionButtonToggleBookmark />
			</View>
		</View>
	);
}

function StatusInteraction() {
	const { dto } = useAppStatusItem();
	const _dto = PostMiddleware.getContentTarget(dto);
	return (
		<View>
			<PostStats dto={_dto} />
			<StatusInteractionButtons />
		</View>
	);
}

export default StatusInteraction;

const styles = StyleSheet.create({
	interactionButtonSection: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
	},
	actionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingTop: 8,
		paddingHorizontal: 6,
	},
});
