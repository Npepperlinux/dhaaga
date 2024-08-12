import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { APP_FONT } from '../../../../../styles/AppTheme';
import {
	BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../_api/useAppBottomSheet';

type ProfilePeekMessageProps = {
	handle: string;
};

const ProfilePeekMessage = memo(({ handle }: ProfilePeekMessageProps) => {
	const { setType, PostComposerTextSeedRef, setVisible, updateRequestId } =
		useAppBottomSheet();

	function onPress() {
		PostComposerTextSeedRef.current = `${handle} `;
		setType(BOTTOM_SHEET_ENUM.STATUS_COMPOSER);
		setVisible(true);
		updateRequestId();
	}

	return (
		<TouchableOpacity
			style={{
				padding: 8,
				backgroundColor: '#202020',
				borderRadius: 8,
			}}
			onPress={onPress}
		>
			<AntDesign name="message1" size={20} color={APP_FONT.MONTSERRAT_BODY} />
		</TouchableOpacity>
	);
});

export default ProfilePeekMessage;
