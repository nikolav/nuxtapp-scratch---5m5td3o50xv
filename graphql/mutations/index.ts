export const M_STORAGE_FILE_REMOVE = gql`
  mutation m_storageRemoveFile($fileID: String!) {
    storageRemoveFile(file_id: $fileID) {
      error
      file {
        id
        data {
          file_id
        }
      }
    }
  }
`;

export const M_docsUpsert = gql`
  mutation m_docsUpsert($topic: String!, $data: JsonData!, $id: ID) {
    docsUpsert(topic: $topic, data: $data, id: $id)
  }
`;

export const M_docsRm = gql`
  mutation m_docsRm($topic: String!, $id: ID!) {
    docsRm(topic: $topic, id: $id)
  }
`;

export const M_docUpsert = gql`
  mutation m_docUpsert(
    $doc_id: String!
    $data: JsonData!
    $merge: Boolean!
    $shallow: Boolean!
  ) {
    docUpsert(doc_id: $doc_id, data: $data, merge: $merge, shallow: $shallow)
  }
`;

export const M_docsTags = gql`
  mutation m_docsTags($id: ID!, $tags: JsonDocsTags!) {
    docsTags(id: $id, tags: $tags)
  }
`;

export const M_sendMail = gql`
  mutation m_sendMail($subject: String!, $template: String!, $data: JsonData!) {
    sendmail(subject: $subject, template: $template, data: $data) {
      error
      status
    }
  }
`;

export const M_cloudMessagingPing = gql`
  mutation m_cloudMessagingPing($payload: JsonData) {
    cloudMessagingPing(payload: $payload)
  }
`;

// accounts
export const M_accountsAdd = gql`
  mutation m_accountsAdd($payload: JsonData!) {
    accountsAdd(payload: $payload)
  }
`;

export const M_accountsPoliciesManage = gql`
  mutation m_accountsPoliciesManage($policies: JsonData!) {
    accountsPoliciesManage(policies: $policies)
  }
`;

// accountsDrop(uid: ID!): JsonData!
export const M_accountsDrop = gql`
  mutation m_accountsDrop($uid: ID!) {
    accountsDrop(uid: $uid)
  }
`;

// accountsProfilePatch(uid: ID!, patch: JsonData!): JsonData!
export const M_accountsProfilePatch = gql`
  mutation m_accountsProfilePatch($uid: ID!, $patch: JsonData!) {
    accountsProfilePatch(uid: $uid, patch: $patch)
  }
`;

// accountsSendVerifyEmailLink(uid: ID!, url: String!): JsonData!
export const M_accountsSendVerifyEmailLink = gql`
  mutation m_accountsSendVerifyEmailLink($uid: ID!, $url: String!) {
    accountsSendVerifyEmailLink(uid: $uid, url: $url)
  }
`;

// accountsVeifyEmail(data: JsonData!): JsonData!
//  data: { key: string:jwt }
export const M_accountsVeifyEmail = gql`
  mutation m_accountsVeifyEmail($data: JsonData!) {
    accountsVeifyEmail(data: $data)
  }
`;

export const M_groupsGUConfigure = gql`
  mutation m_groupsGUConfigure($guConfig: JsonData!) {
    groupsGUConfigure(guConfig: $guConfig)
  }
`;

// assetsRemove(aids: [ID!]!, SOFT: Boolean): JsonData!
export const M_assetsRemove = gql`
  mutation m_assetsRemove($aids: [ID!]!) {
    assetsRemove(aids: $aids)
  }
`;

// assetsUpsert(fields: JsonData!, aid: ID): JsonData!
export const M_assetsUpsert = gql`
  mutation m_assetsUpsert($fields: JsonData!, $aid: ID) {
    assetsUpsert(fields: $fields, aid: $aid)
  }
`;

// commsMessageMany(uids: [ID!]!, message: JsonData!): JsonData!
export const M_commsMessageMany = gql`
  mutation m_commsMessageMany($uids: [ID!]!, $message: JsonData!) {
    commsMessageMany(uids: $uids, message: $message)
  }
`;

// cloudMessagingNotifications(uids: [ID!]!, payload: JsonData!): JsonData!
export const M_cloudMessagingNotifications = gql`
  mutation m_cloudMessagingNotifications($uids: [ID!]!, $payload: JsonData!) {
    cloudMessagingNotifications(uids: $uids, payload: $payload)
  }
`;

// # usersTagsManage(tags: JsonData!): JsonData!
export const M_usersTagsManage = gql`
  mutation m_usersTagsManage($tags: JsonData!) {
    usersTagsManage(tags: $tags)
  }
`;

// cacheRedisCommit(cache_key: String!, patch: JsonData, merge: Boolean): JsonData!
export const M_cacheRedisCommit = gql`
  mutation m_cacheRedisCommit(
    $cache_key: String!
    $patch: JsonData
    $merge: Boolean
  ) {
    cacheRedisCommit(cache_key: $cache_key, patch: $patch, merge: $merge)
  }
`;

// commsGroupMessageMany(gids: [ID!]!, message: JsonData!): JsonData!
export const M_commsGroupMessageMany = gql`
  mutation m_commsGroupMessageMany($gids: [ID!]!, $message: JsonData!) {
    commsGroupMessageMany(gids: $gids, message: $message)
  }
`;

// assetsAGConfig(ag_config: JsonData!, assets_type: String!): JsonData!
export const M_assetsAGConfig = gql`
  mutation m_assetsAGConfig($ag_config: JsonData!, $assets_type: String!) {
    assetsAGConfig(ag_config: $ag_config, assets_type: $assets_type)
  }
`;

// cloudMessagingNotificationsChats(cids: [ID!]!, payload: JsonData!, AND_THIS: Boolean): JsonData!
export const M_cloudMessagingNotificationsChats = gql`
  mutation m_cloudMessagingNotificationsChats(
    $cids: [ID!]!
    $payload: JsonData!
    $AND_THIS: Boolean
  ) {
    cloudMessagingNotificationsChats(
      cids: $cids
      payload: $payload
      AND_THIS: $AND_THIS
    )
  }
`;

// assetsPatchData(aid: ID!, patch: JsonData!): JsonData!
export const M_assetsPatchData = gql`
  mutation m_assetsPatchData($aid: ID!, $patch: JsonData!) {
    assetsPatchData(aid: $aid, patch: $patch)
  }
`;

// assetsFormsSubmission(data: JsonData!, fid: ID!, key: String): JsonData!
export const M_assetsFormsSubmission = gql`
  mutation m_assetsFormsSubmission($data: JsonData!, $fid: ID!, $key: String) {
    assetsFormsSubmission(data: $data, fid: $fid, key: $key)
  }
`;

// reportsDrop(ids: [ID!]!): JsonData!
export const M_reportsDrop = gql`
  mutation m_reportsDrop($ids: [ID!]!) {
    reportsDrop(ids: $ids)
  }
`;

// reportsConfigurationTags(ids: [ID!]!, config: JsonData!): JsonData!
// config: { tags?: Record<tag:string, active:boolean> }
export const M_reportsConfigurationTags = gql`
  mutation m_reportsConfigurationTags($ids: [ID!]!, $config: JsonData!) {
    reportsConfigurationTags(ids: $ids, config: $config)
  }
`;

// viberChannelSetupSetWebhook(url: String!, auth_token: String!, is_global: Boolean): JsonData!
export const M_viberChannelSetupSetWebhook = gql`
  mutation m_viberChannelSetupSetWebhook(
    $url: String!
    $auth_token: String!
    $is_global: Boolean
  ) {
    viberChannelSetupSetWebhook(
      url: $url
      auth_token: $auth_token
      is_global: $is_global
    )
  }
`;

// viberChannelSetupChannelsDrop(channelNames: [String!]): JsonData!
export const M_viberChannelSetupChannelsDrop = gql`
  mutation m_viberChannelSetupChannelsDrop($channelNames: [String!]) {
    viberChannelSetupChannelsDrop(channelNames: $channelNames)
  }
`;

// assetsManageTags(aid: ID!, config: JsonData!): JsonData!
export const M_assetsManageTags = gql`
  mutation m_assetsManageTags($aid: ID!, $config: JsonData!) {
    assetsManageTags(aid: $aid, config: $config)
  }
`;
