/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/version3.json`.
 */
export type Version3 = {
  "address": "6qrkjKfD3zALj1ANfKdmz1wP8688xZvsC5R8R5H2bz56",
  "metadata": {
    "name": "version3",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addCidEntry",
      "discriminator": [
        124,
        8,
        230,
        28,
        59,
        233,
        164,
        223
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "masterhash"
              }
            ]
          }
        },
        {
          "name": "cidEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  105,
                  99
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "arg",
                "path": "cEntryIndex"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "masterhash",
          "type": "pubkey"
        },
        {
          "name": "cEntryIndex",
          "type": "u64"
        },
        {
          "name": "cid",
          "type": "string"
        }
      ]
    },
    {
      "name": "addVaultEntry",
      "discriminator": [
        71,
        222,
        28,
        138,
        157,
        179,
        57,
        68
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "masterhash"
              }
            ]
          }
        },
        {
          "name": "vaultEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  110,
                  116,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "arg",
                "path": "entryIndex"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "masterhash",
          "type": "pubkey"
        },
        {
          "name": "entryIndex",
          "type": "u64"
        },
        {
          "name": "webiste",
          "type": "string"
        },
        {
          "name": "uname",
          "type": "string"
        },
        {
          "name": "pass",
          "type": "string"
        }
      ]
    },
    {
      "name": "deleteCid",
      "discriminator": [
        39,
        230,
        146,
        240,
        53,
        19,
        196,
        226
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "masterhash"
              }
            ]
          }
        },
        {
          "name": "cidEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  105,
                  99
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "arg",
                "path": "cEntryIndex"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "masterhash",
          "type": "pubkey"
        },
        {
          "name": "cEntryIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteEntry",
      "discriminator": [
        227,
        198,
        83,
        191,
        70,
        23,
        194,
        58
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "masterhash"
              }
            ]
          }
        },
        {
          "name": "vaultEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  110,
                  116,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "arg",
                "path": "entryIndex"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "masterhash",
          "type": "pubkey"
        },
        {
          "name": "entryIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeVault",
      "discriminator": [
        48,
        191,
        163,
        44,
        71,
        129,
        63,
        164
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "masterhash"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "masterhash",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateEntry",
      "discriminator": [
        70,
        47,
        181,
        2,
        1,
        40,
        2,
        92
      ],
      "accounts": [
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "masterhash"
              }
            ]
          }
        },
        {
          "name": "vaultEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  110,
                  116,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "arg",
                "path": "entryIndex"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "masterhash",
          "type": "pubkey"
        },
        {
          "name": "entryIndex",
          "type": "u64"
        },
        {
          "name": "webiste",
          "type": "string"
        },
        {
          "name": "uname",
          "type": "string"
        },
        {
          "name": "pass",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "cidEntry",
      "discriminator": [
        145,
        9,
        199,
        248,
        9,
        2,
        196,
        104
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    },
    {
      "name": "vaultEntry",
      "discriminator": [
        247,
        13,
        244,
        166,
        187,
        153,
        172,
        22
      ]
    }
  ],
  "types": [
    {
      "name": "cidEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cid",
            "type": "string"
          },
          {
            "name": "timeStored",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "masterhash",
            "type": "pubkey"
          },
          {
            "name": "entryCount",
            "type": "u64"
          },
          {
            "name": "cidCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "website",
            "type": "string"
          },
          {
            "name": "uname",
            "type": "string"
          },
          {
            "name": "pass",
            "type": "string"
          },
          {
            "name": "timeStored",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
