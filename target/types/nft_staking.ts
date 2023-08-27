export type NftStaking = {
  "version": "0.1.0",
  "name": "nft_staking",
  "instructions": [
    {
      "name": "unlockPnft",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "data",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorizationRules",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mplTokenAuthRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAtaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstruction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonceSigner",
          "type": "u8"
        },
        {
          "name": "nonceVault",
          "type": "u8"
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AuthorityInvalid",
      "msg": "Authority is invalid"
    },
    {
      "code": 6001,
      "name": "OutRange",
      "msg": "Index out of range"
    },
    {
      "code": 6002,
      "name": "InvalidAttribute",
      "msg": "Invalid attribute"
    },
    {
      "code": 6003,
      "name": "InvalidToken",
      "msg": "Invalid token"
    }
  ]
};

export const IDL: NftStaking = {
  "version": "0.1.0",
  "name": "nft_staking",
  "instructions": [
    {
      "name": "unlockPnft",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "data",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorizationRules",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mplTokenAuthRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAtaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstruction",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonceSigner",
          "type": "u8"
        },
        {
          "name": "nonceVault",
          "type": "u8"
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AuthorityInvalid",
      "msg": "Authority is invalid"
    },
    {
      "code": 6001,
      "name": "OutRange",
      "msg": "Index out of range"
    },
    {
      "code": 6002,
      "name": "InvalidAttribute",
      "msg": "Invalid attribute"
    },
    {
      "code": 6003,
      "name": "InvalidToken",
      "msg": "Invalid token"
    }
  ]
};
