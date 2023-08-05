import { useCallback, useEffect, useRef, useState } from "react";
import { AccountState } from "../../../libs/redux/slices/account";
import { RootState } from "../../../libs/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
	Animated,
	SafeAreaView,
	StatusBar,
	View,
	StyleSheet,
	Text,
	RefreshControl,
} from "react-native";
import { getCloser } from "../../../utils";
import Header from "../../../components/Header";
import {
	RestClient,
	RestServices,
} from "@dhaaga/shared-provider-mastodon/dist";
import { useQuery } from "@tanstack/react-query";
import StatusFragment from "../fragments/StatusFragment";
import TimelinesHeader from "../../../components/TimelineHeader";
import { NotesAPI, createClient } from "@dhaaga/shared-provider-misskey/dist";

const { diffClamp } = Animated;
const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;

/**
 *
 * @returns Timeline rendered for Mastodon
 */
function TimelineRenderer() {
	const dispatch = useDispatch();
	const accountState = useSelector<RootState, AccountState>((o) => o.account);

	const restClient = useRef(null);

	function getHomeTimeline() {
		if (!restClient.current) {
			throw new Error("client not initialized");
		}

		if (accountState.activeAccount.domain === "mastodon") {
			return RestServices.v1.default.timelines.default.getHomeTimeline(
				restClient.current
			);
		} else if (accountState.activeAccount.domain === "misskey") {
			return NotesAPI.localTimeline(restClient.current);
		}
		return [];
	}
	// Queries
	const { status, data, error, fetchStatus, refetch } = useQuery({
		queryKey: ["mastodon/timelines/home", restClient],
		queryFn: getHomeTimeline,
	});

	useEffect(() => {
		if (!accountState.activeAccount) {
			restClient.current = null;
			console.log("have not selected any account");
			return;
		}

		const token = accountState.credentials.find(
			(o) => o.credential_type === "access_token"
		)?.credential_value;
		if (!token) {
			restClient.current = null;
			console.log("token not found");
			return;
		}

		if (accountState.activeAccount.domain === "mastodon") {
			const client = new RestClient(
				accountState.activeAccount.subdomain,
				token
			);
			restClient.current = client;
		} else if (accountState.activeAccount.domain === "misskey") {
			const client = createClient(accountState.activeAccount.subdomain, token);
			console.log("successfully created client", client);
			restClient.current = client;
		}
	}, [accountState]);

	const ref = useRef(null);

	const scrollY = useRef(new Animated.Value(0));
	const scrollYClamped = diffClamp(
		scrollY.current,
		0,
		HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT
	);

	const translateY = scrollYClamped.interpolate({
		inputRange: [0, HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT],
		outputRange: [0, -HIDDEN_SECTION_HEIGHT],
	});

	const translateYNumber = useRef();

	translateY.addListener(({ value }) => {
		translateYNumber.current = value;
	});

	const handleScroll = Animated.event(
		[
			{
				nativeEvent: {
					contentOffset: { y: scrollY.current },
				},
			},
		],
		{
			useNativeDriver: true,
		}
	);

	/**
	 * When scroll view has stopped moving,
	 * snap to the nearest section
	 * @param param0
	 */
	const handleSnap = ({ nativeEvent }) => {
		const offsetY = nativeEvent.contentOffset.y;
		if (
			!(
				translateYNumber.current === 0 ||
				translateYNumber.current === -HIDDEN_SECTION_HEIGHT
			)
		) {
			if (ref.current) {
				try {
					/**
					 * ScrollView --> scrollo ???
					 * FlatView --> scrollToOffset({offset: number}})
					 */
					ref.current.scrollTo({
						// applies only for flat list
						offset:
							getCloser(translateYNumber.current, -HIDDEN_SECTION_HEIGHT, 0) ===
							-HIDDEN_SECTION_HEIGHT
								? offsetY + HIDDEN_SECTION_HEIGHT
								: offsetY - HIDDEN_SECTION_HEIGHT,
					});
				} catch (e) {
					console.log("[WARN]: component is not a flat list");
				}
			}
		}
	};

	useEffect(() => {
		if (status === "success") {
			setRefreshing(false);
		}
	}, [status, fetchStatus]);

	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refetch();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#1c1c1c" />
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader
					SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
					HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
				/>
			</Animated.View>

			<Animated.ScrollView
				contentContainerStyle={{
					paddingTop: SHOWN_SECTION_HEIGHT + HIDDEN_SECTION_HEIGHT,
				}}
				onScroll={handleScroll}
				ref={ref}
				contentInset={{
					top: SHOWN_SECTION_HEIGHT + HIDDEN_SECTION_HEIGHT + 1000,
				}}
				// contentOffset={{y: -headerHeight}}

				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<Text style={{ color: "white" }}>
					Showing 0-{data?.length || 0} results
				</Text>
				{data && data.map((o, i) => <StatusFragment key={i} status={o} />)}
			</Animated.ScrollView>
		</SafeAreaView>
	);
}

export default TimelineRenderer;

const styles = StyleSheet.create({
	header: {
		position: "absolute",
		backgroundColor: "#1c1c1c",
		left: 0,
		right: 0,
		width: "100%",
		zIndex: 1,
	},
	subHeader: {
		height: SHOWN_SECTION_HEIGHT,
		width: "100%",
		paddingHorizontal: 10,
	},
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
});
