import { LibraryResponse } from '../_router/_types.js';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { MissNote } from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';

export class MisskeyStatusesRouter implements StatusesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async get(id: string): Promise<LibraryResponse<MissNote>> {
		const data = await this.lib.client.request('notes/show', { noteId: id });
		return { data };
	}

	async getReactions(id: string) {
		// return await client.request('notes/reactions', { noteId });
	}
}
