# ProfileInfoApi

The ProfileInfoApi type is defined at
[packages/core-api/src/apis/definitions/auth.ts:127](https://github.com/spotify/backstage/blob/f8780ff32509d0326bc513791ea60846d7614b34/packages/core-api/src/apis/definitions/auth.ts#L127).

The following Utility APIs implement this type:

- [githubAuthApiRef](./README.md#githubauth)

- [gitlabAuthApiRef](./README.md#gitlabauth)

- [googleAuthApiRef](./README.md#googleauth)

- [oauth2ApiRef](./README.md#oauth2)

- [oktaAuthApiRef](./README.md#oktaauth)

## Members

### getProfile()

Get profile information for the user as supplied by this auth provider.

If the optional flag is not set, a session is guaranteed to be returned, while
if the optional flag is set, the session may be undefined. See
@AuthRequestOptions for more details.

<pre>
getProfile(options?: <a href="#authrequestoptions">AuthRequestOptions</a>): Promise&lt;<a href="#profileinfo">ProfileInfo</a> | undefined&gt;
</pre>

## Supporting types

These types are part of the API declaration, but may not be unique to this API.

### AuthRequestOptions

<pre>
export type AuthRequestOptions = {
  /**
   * If this is set to true, the user will not be prompted to log in,
   * and an empty response will be returned if there is no existing session.
   *
   * This can be used to perform a check whether the user is logged in, or if you don't
   * want to force a user to be logged in, but provide functionality if they already are.
   *
   * @default false
   */
  optional?: boolean;

  /**
   * If this is set to true, the request will bypass the regular oauth login modal
   * and open the login popup directly.
   *
   * The method must be called synchronously from a user action for this to work in all browsers.
   *
   * @default false
   */
  instantPopup?: boolean;
}
</pre>

Defined at
[packages/core-api/src/apis/definitions/auth.ts:40](https://github.com/spotify/backstage/blob/f8780ff32509d0326bc513791ea60846d7614b34/packages/core-api/src/apis/definitions/auth.ts#L40).

Referenced by: [getProfile](#getprofile).

### ProfileInfo

Profile information of the user.

<pre>
export type ProfileInfo = {
  /**
   * Email ID.
   */
  email?: string;

  /**
   * Display name that can be presented to the user.
   */
  displayName?: string;

  /**
   * URL to an avatar image of the user.
   */
  picture?: string;
}
</pre>

Defined at
[packages/core-api/src/apis/definitions/auth.ts:172](https://github.com/spotify/backstage/blob/f8780ff32509d0326bc513791ea60846d7614b34/packages/core-api/src/apis/definitions/auth.ts#L172).

Referenced by: [getProfile](#getprofile).
