import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { useEffect, useState } from 'react';
import { useAppDb } from '../../../../hooks/utility/global-state-extractors';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../../features/timelines/contexts/PostTimelineCtx';
import {
	AppTimelineReducerActionType,
	TimelineFetchMode,
} from '../../../../states/interactors/post-timeline.reducer';
import useTimeline from '../../../../features/timelines/api/useTimeline';
import { PostTimeline } from '../../../data-views/PostTimeline';

function DataView() {
	const [Refreshing, setRefreshing] = useState(false);
	const { db } = useAppDb();

	// state management
	const State = useTimelineState();
	const dispatch = useTimelineDispatch();

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: AppTimelineReducerActionType.INIT,
			payload: {
				db,
			},
		});

		dispatch({
			type: AppTimelineReducerActionType.RESET_USING_QUERY,
			payload: {
				type: TimelineFetchMode.LIKES,
			},
		});
	}, [db]);

	const { fetchStatus, data, status, refetch } = useTimeline({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	function loadMore() {
		dispatch({
			type: AppTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	/**
	 * Composite Hook Collection
	 */
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: State.items.length,
		updateQueryCache: loadMore,
	});

	function onRefresh() {
		setRefreshing(true);
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	return (
		<WithAutoHideTopNavBar title={'My Liked Posts'} translateY={translateY}>
			<PostTimeline
				data={State.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				fetchStatus={fetchStatus}
			/>
		</WithAutoHideTopNavBar>
	);
}

function MyLikes() {
	return (
		<WithPostTimelineCtx>
			<DataView />
		</WithPostTimelineCtx>
	);
}

export default MyLikes;
