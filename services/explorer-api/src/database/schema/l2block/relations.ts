import { relations } from "drizzle-orm";

import {
  body,
  bodyToTxEffects,
  functionLogs,
  logs,
  publicDataWrite,
  txEffect,
  txEffectToLogs,
  txEffectToPublicDataWrite,
} from "./body.js";
import {
  contentCommitment,
  gasFees,
  globalVariables,
  header,
  l1ToL2MessageTree,
  lastArchive,
  noteHashTree,
  nullifierTree,
  partial,
  publicDataTree,
  state,
} from "./header.js";
import { archive, l2Block } from "./root.js";

export const l2BlockRelations = relations(l2Block, ({ one }) => ({
  archive: one(archive, {
    fields: [l2Block.archiveId],
    references: [archive.id],
  }),
  header: one(header, {
    fields: [l2Block.headerId],
    references: [header.id],
  }),
  body: one(body, {
    fields: [l2Block.bodyId],
    references: [body.id],
  }),
}));

export const archiveRelations = relations(archive, ({ one }) => ({
  l2Block: one(l2Block),
}));

export const headerRelations = relations(header, ({ one }) => ({
  l2Block: one(l2Block),
  lastArchive: one(lastArchive, {
    fields: [header.lastArchiveId],
    references: [lastArchive.id],
  }),
  contentCommitment: one(contentCommitment, {
    fields: [header.contentCommitmentId],
    references: [contentCommitment.id],
  }),
  state: one(state, {
    fields: [header.stateId],
    references: [state.id],
  }),
  globalVariables: one(globalVariables, {
    fields: [header.globalVariablesId],
    references: [globalVariables.id],
  }),
}));

export const lastArchiveRelations = relations(lastArchive, ({ one }) => ({
  header: one(header),
}));

export const contentCommitmentRelations = relations(
  contentCommitment,
  ({ one }) => ({
    header: one(header),
  })
);

export const stateRelations = relations(state, ({ one }) => ({
  header: one(header),
  l1ToL2MessageTree: one(l1ToL2MessageTree, {
    fields: [state.l1ToL2MessageTreeId],
    references: [l1ToL2MessageTree.id],
  }),
  partial: one(partial, {
    fields: [state.partialId],
    references: [partial.id],
  }),
}));

export const l1ToL2MessageTreeRelations = relations(
  l1ToL2MessageTree,
  ({ one }) => ({
    state: one(state),
  })
);

export const partialRelations = relations(partial, ({ one }) => ({
  state: one(state),
  noteHashTree: one(noteHashTree, {
    fields: [partial.noteHashTreeId],
    references: [noteHashTree.id],
  }),
  nullifierTree: one(nullifierTree, {
    fields: [partial.nullifierTreeId],
    references: [nullifierTree.id],
  }),
  publicDataTree: one(publicDataTree, {
    fields: [partial.publicDataTreeId],
    references: [publicDataTree.id],
  }),
}));

export const noteHashTreeRelations = relations(noteHashTree, ({ one }) => ({
  partial: one(partial),
}));

export const nullifierTreeRelations = relations(nullifierTree, ({ one }) => ({
  partial: one(partial),
}));

export const publicDataTreeRelations = relations(publicDataTree, ({ one }) => ({
  partial: one(partial),
}));

export const globalVariablesRelations = relations(
  globalVariables,
  ({ one }) => ({
    header: one(header),
    gasFees: one(gasFees, {
      fields: [globalVariables.gasFeesId],
      references: [gasFees.id],
    }),
  })
);

export const gasFeesRelations = relations(gasFees, ({ one }) => ({
  globalVariables: one(globalVariables),
}));

export const bodyRelations = relations(body, ({ one, many }) => ({
  l2Block: one(l2Block),
  bodyToTxEffects: many(bodyToTxEffects),
}));

export const bodyToTxEffectsRelations = relations(
  bodyToTxEffects,
  ({ one }) => ({
    body: one(body),
    txEffect: one(txEffect),
  })
);

export const txEffectRelations = relations(txEffect, ({ one, many }) => ({
  bodyToTxEffects: one(bodyToTxEffects),
  publicDataWrite: many(txEffectToPublicDataWrite),
  functionLogs: many(functionLogs),
  txEffectToLogs: many(txEffectToLogs),
}));

export const txEffectToPublicDataWriteRelations = relations(
  txEffectToPublicDataWrite,
  ({ one, many }) => ({
    txEffect: one(txEffect),
    publicDataWrite: many(publicDataWrite),
  })
);

export const publicDataWriteRelations = relations(
  publicDataWrite,
  ({ one }) => ({
    txEffect: one(txEffect),
  })
);

export const logsRelations = relations(logs, ({ many }) => ({
  txEffectToLogs: many(txEffectToLogs),
}));

export const functionLogsRelations = relations(
  functionLogs,
  ({ one, many }) => ({
    txEffect: one(txEffect, {
      fields: [functionLogs.txEffectId],
      references: [txEffect.id],
    }),
    txEffectToLogs: many(txEffectToLogs),
  })
);

export const txEffectToLogsRelations = relations(txEffectToLogs, ({ one }) => ({
  txEffect: one(txEffect, {
    fields: [txEffectToLogs.txEffectId],
    references: [txEffect.id],
  }),
  log: one(logs, {
    fields: [txEffectToLogs.logId],
    references: [logs.id],
  }),
  functionLog: one(functionLogs, {
    fields: [txEffectToLogs.functionLogId],
    references: [functionLogs.id],
  }),
}));
