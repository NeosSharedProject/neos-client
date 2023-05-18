export type NeosId<T extends string> = string; //`${T}-${string}`;

export type NeosUserId = NeosId<"U">;

export type NeosGroupId = NeosId<"G">;

export type NeosOwnerId = NeosUserId | NeosGroupId;

export type NeosRecordId = NeosId<"R">;

export type NeosMessageId = NeosId<"MSG">;

export type NeosSessionId = NeosId<"S">;

export type NeosMachineId = string;
