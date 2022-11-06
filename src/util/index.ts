export function escapeTagString(str: string) {
  return str.replace(
    /<align=(left|center|right)>|<\/align>|<color=[^<>]*>|<\/color>|<b>|<\/b>|<i>|<\/i>|<lowercase>|<\/lowercase>|<uppercase>|<\/uppercase>|<smallcaps>|<\/smallcaps>|<mark=[^<>]>|<\/mark>|<noparse>|<\/noparse>|<nobr>|<\/nobr>|<size=[^<>]*>|<\/size>|<s>|<\/s>|<u>|<\/u>|<sub>|<\/sub>|<sup>|<\/sup>/g,
    ""
  );
}

export function neosdb2https(neosdbUrl: string): string | undefined {
  if (!neosdbUrl) {
    return undefined;
  }
  const sl0 = neosdbUrl?.split("///");
  if (sl0.length != 2) {
    return undefined;
  }
  const sl1 = sl0[1].split(".");
  if (sl1.length != 2) {
    return `https://cloudxstorage.blob.core.windows.net/assets/${sl0[1]}`;
  } else {
    return `https://cloudxstorage.blob.core.windows.net/assets/${sl1[0]}`;
  }
}
