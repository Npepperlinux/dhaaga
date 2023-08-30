import {
	NoteInstance,
	NoteToStatusAdapter,
	StatusInstance,
	StatusInterface,
	StatusToStatusAdapter,
	UnknownToStatusAdapter,
	UserDetailedInstance,
	UserDetailedToUserProfileAdapter,
	UserProfileInterface,
} from "@dhaaga/shared-abstraction-activitypub/src";
import { mastodon } from "@dhaaga/shared-provider-mastodon/src";
import { Note, UserDetailed } from "@dhaaga/shared-provider-misskey/src";

/**
 *
 * @param status
 * @param domain
 * @returns
 */
export function adaptSharedProtocol(
	status: any,
	domain: string
): StatusInterface {
	switch (domain) {
		case "misskey": {
			return new NoteToStatusAdapter(new NoteInstance(status as Note));
		}
		case "mastodon": {
			return new StatusToStatusAdapter(
				new StatusInstance(status as mastodon.v1.Status)
			);
		}
		default: {
			return new UnknownToStatusAdapter();
		}
	}
}

export function adaptUserProfile(
	profile: any,
	domain: string
): UserProfileInterface {
	switch (domain) {
		case "misskey": {
			return new UserDetailedToUserProfileAdapter(
				new UserDetailedInstance(profile as UserDetailed)
			);
		}
		default: {
			// return new UnknownToStatusAdapter();
		}
	}
}
