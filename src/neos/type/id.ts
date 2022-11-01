export type NeosIdType<T extends string> = `${T}-${string}`;

export type NeosUserIdType = NeosIdType<"U">;

export type NeosGroupIdType = NeosIdType<"G">;

export type NeosOwnerIdType = NeosUserIdType | NeosGroupIdType;

export type NeosRecordIdType = NeosIdType<"R">;

export type NeosMessageIdType = NeosIdType<"MSG">;

export type NeosSessionIdType = NeosIdType<"S">;

export type NeosMachineIdType = string;
