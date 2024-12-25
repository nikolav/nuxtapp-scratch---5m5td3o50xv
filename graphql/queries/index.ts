export const Q_storageList = gql`
  query q_storageList {
    storageList {
      id
      file_id
      title
      description
      filename
      path
      size
      mimetype
      public
      created_at
      updated_at
    }
  }
`;

export const Q_storageListAll = gql`
  query q_storageListAll {
    storageListAll {
      id
      file_id
      title
      description
      filename
      path
      size
      mimetype
      public
      created_at
      updated_at
    }
  }
`;

// docsByTopic(topic: String!, order: Int, search: JsonData): [JsonData!]!
export const Q_docsByTopic = gql`
  query q_docsByTopic($topic: String!, $order: Int, $search: JsonData) {
    docsByTopic(topic: $topic, order: $order, search: $search)
  }
`;

export const Q_docByDocId = gql`
  query q_docByDocId($doc_id: String!) {
    docByDocId(doc_id: $doc_id)
  }
`;

export const Q_apiStatus = gql`
  query q_apiStatus {
    status
  }
`;

/////////////
/////////////
/////////////

export const Q_usersOnly = gql`
  query q_usersOnly($uids: [ID!]!) {
    usersOnly(uids: $uids) {
      id
      email
      profile
      key
      is_approved
      is_manager
      is_admin
      is_external
      is_available
      tags
      groups
      email_verified
      created_at
      updated_at
    }
  }
`;

// users(skip_external: Boolean): [User!]!
export const Q_users = gql`
  query q_users($skip_external: Boolean) {
    users(skip_external: $skip_external) {
      id
      email
      profile
      key
      is_approved
      is_manager
      is_admin
      is_external
      is_available
      tags
      groups
      email_verified
      created_at
      updated_at
    }
  }
`;

// @@
// assetsList(aids: [ID!], type: String, own: Boolean, aids_subs_only: [ID!], aids_subs_type: String, children: Boolean): [Asset!]!
export const Q_assetsList = gql`
  query q_assetsList(
    $aids: [ID!]
    $type: String
    $own: Boolean
    $aids_subs_only: [ID!]
    $aids_subs_type: String
    $children: Boolean
    $category: String
    $my_only: Boolean
    $ordered: String
    $blacklist_tags: [String!]
    $whitelist_tags: [String!]
    $search: JsonData
  ) {
    assetsList(
      aids: $aids
      type: $type
      own: $own
      aids_subs_only: $aids_subs_only
      aids_subs_type: $aids_subs_type
      children: $children
      category: $category
      my_only: $my_only
      ordered: $ordered
      blacklist_tags: $blacklist_tags
      whitelist_tags: $whitelist_tags
      search: $search
    ) {
      id
      name
      code
      type
      location
      status
      condition
      data
      notes
      key
      author_id
      tags
      author {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      users {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      docs
      created_at
      updated_at
    }
  }
`;

// tagsSearchTagLike(search: String!, prefix: String, attach: String): [String!]!
export const Q_tagsSearchTagLike = gql`
  query q_tagsSearchTagLike(
    $search: String!
    $prefix: String
    $attach: String
  ) {
    tagsSearchTagLike(search: $search, prefix: $prefix, attach: $attach)
  }
`;

// cacheRedisGetCacheByKey(cache_key: String!): JsonData!
export const Q_cacheRedisGetCacheByKey = gql`
  query q_cacheRedisGetCacheByKey($cache_key: String!) {
    cacheRedisGetCacheByKey(cache_key: $cache_key)
  }
`;

// usersSharedGroups(uids: [ID!]): [User!]!
export const Q_usersSharedGroups = gql`
  query q_usersSharedGroups($uids: [ID!]) {
    usersSharedGroups(uids: $uids) {
      id
      email
      profile
      key
      is_approved
      is_manager
      is_admin
      is_external
      is_available
      tags
      groups
      email_verified
      created_at
      updated_at
    }
  }
`;

// usersTagged(tags: [String!]!, ALL: Boolean): [User!]!
export const Q_usersTagged = gql`
  query q_usersTagged($tags: [String!]!, $ALL: Boolean) {
    usersTagged(tags: $tags, ALL: $ALL) {
      id
      email
      profile
      key
      is_approved
      is_manager
      is_admin
      is_external
      is_available
      tags
      groups
      email_verified
      created_at
      updated_at
    }
  }
`;

// usersQ(q: String!, limit: Int): [User!]!
export const Q_usersQ = gql`
  query q_usersQ($q: String!, $limit: Int) {
    usersQ(q: $q, limit: $limit) {
      id
      email
      profile
      key
      is_approved
      is_manager
      is_admin
      is_external
      is_available
      tags
      groups
      email_verified
      created_at
      updated_at
    }
  }
`;

// usersByGroups(gids: [ID!]!, ALL: Boolean): [User!]!
export const Q_usersByGroups = gql`
  query q_usersByGroups($gids: [ID!]!, $ALL: Boolean) {
    usersByGroups(gids: $gids, ALL: $ALL) {
      id
      email
      profile
      key
      is_approved
      is_manager
      is_admin
      is_external
      is_available
      tags
      groups
      email_verified
      created_at
      updated_at
    }
  }
`;

// assetsSearchQ(q: String!, type: String, limit: Int): [Asset!]!
export const Q_assetsSearchQ = gql`
  query q_assetsSearchQ($q: String!, $type: String, $limit: Int) {
    assetsSearchQ(q: $q, type: $type, limit: $limit) {
      id
      name
      code
      type
      location
      status
      condition
      data
      notes
      key
      author_id
      tags
      author {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      users {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      docs
      created_at
      updated_at
    }
  }
`;

// assetsCount(asset_type: String!, own: Boolean, category: String): JsonData!
export const Q_assetsCount = gql`
  query q_assetsCount($asset_type: String!, $own: Boolean, $category: String) {
    assetsCount(asset_type: $asset_type, own: $own, category: $category)
  }
`;

// assetsFormsSubmissionsList(strategy: String, args: [JsonData!]): [Docs!]!
export const Q_assetsFormsSubmissionsList = gql`
  query q_assetsFormsSubmissionsList($strategy: String, $args: [JsonData!]) {
    assetsFormsSubmissionsList(strategy: $strategy, args: $args) {
      id
      key
      data
      tags
      asset {
        id
        name
        code
        type
        location
        status
        condition
        data
        notes
        key
        author_id
        tags
      }
      user {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      created_at
      updated_at
    }
  }
`;

// reportsSearch(query_strategy: String!, query_strategy_args: JsonData): JsonData!
export const Q_reportsSearch = gql`
  query q_reportsSearch(
    $query_strategy: String!
    $query_strategy_args: JsonData
  ) {
    reportsSearch(
      query_strategy: $query_strategy
      query_strategy_args: $query_strategy_args
    )
  }
`;

// groupsByUser(uid: ID!): [Asset!]!
export const Q_groupsByUser = gql`
  query q_groupsByUser($uid: ID!) {
    groupsByUser(uid: $uid) {
      id
      name
      code
      type
      location
      status
      condition
      data
      notes
      key
      author_id
      tags
      author {
        id
        email
        key
        created_at
        updated_at
      }
      docs
      created_at
      updated_at
    }
  }
`;

// assetsPostsReadable(uids: [ID!], pagination: JsonData, assets_rows: JsonData): [Asset!]!
export const Q_assetsPostsReadable = gql`
  query q_assetsPostsReadable(
    $uids: [ID!]
    $pagination: JsonData
    $assets_rows: JsonData
  ) {
    assetsPostsReadable(
      uids: $uids
      pagination: $pagination
      assets_rows: $assets_rows
    ) {
      id
      name
      code
      type
      location
      status
      condition
      data
      notes
      key
      author_id
      tags
      author {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      users {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      docs
      created_at
      updated_at
    }
  }
`;

// googleapisPlacesNearby(location: JsonData!, next_page_token: String): JsonData!
export const Q_googleapisPlacesNearby = gql`
  query q_googleapisPlacesNearby(
    $location: JsonData!
    $next_page_token: String
  ) {
    googleapisPlacesNearby(
      location: $location
      next_page_token: $next_page_token
    )
  }
`;

// assetsAssetsSitesOrders(sid: ID!): [Orders!]!
export const Q_assetsAssetsSitesOrders = gql`
  query q_assetsAssetsSitesOrders($sid: ID!) {
    assetsAssetsSitesOrders(sid: $sid) {
      id
      key
      status
      data
      notes
      author_id
      site_id
      tags
      author {
        id
        email
        profile
        key
        is_approved
        is_manager
        is_admin
        is_external
        is_available
        tags
        groups
        created_at
        updated_at
      }
      products {
        id
      }
      created_at
      updated_at
    }
  }
`;

// ordersProductsAmounts(ooid: ID!): OrderItems!
export const Q_ordersProductsAmounts = gql`
  query q_ordersProductsAmounts($ooid: ID!) {
    ordersProductsAmounts(ooid: $ooid) {
      order {
        id
        key
        status
        data
        notes
        author_id
        site_id
        tags
        products {
          id
        }
        author {
          id
          email
          profile
          key
          is_approved
          is_manager
          is_admin
          is_external
          is_available
          tags
          groups
          created_at
          updated_at
        }
        site {
          id
          name
          code
          type
          location
          status
          condition
          data
          notes
          key
          tags
          docs
          created_at
          updated_at
        }
        created_at
        updated_at
      }
      items {
        amount
        product {
          id
          name
          code
          type
          location
          status
          condition
          data
          notes
          key
          tags
          created_at
          updated_at
        }
      }
    }
  }
`;
