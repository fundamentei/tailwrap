import { getDefaultConfig } from "tailwind-merge";
import { createConfigUtils } from "tailwind-merge/src/lib/config-utils";
import { IMPORTANT_MODIFIER, sortModifiers } from "tailwind-merge/src/lib/modifier-utils";

export default function wrap(
  classList: string,
  groupByStrategy: "MODIFIER" | "GROUP",
  wrapStrategy: "CONCAT" | "CLASSNAMES" = "CLASSNAMES"
) {
  const groups = groupClassList(classList, groupByStrategy);
  const lines = groups.map((line) => {
    return `"${line.join(" ")}"`;
  });
  if (wrapStrategy === "CLASSNAMES") {
    return `
classNames(
  ${lines.join(",\n  ")}
)
    `.trim();
  }

  if (wrapStrategy === "CONCAT") {
    return lines.join(` + " " + \n`);
  }

  return classList;
}

// This stuff is all taken from the tailwind-merge source code. Whoever did it, is brilliant and should have all due
// respect for making this possible. I'm just using it to make my life easier...
const SPLIT_CLASSES_REGEX = /\s+/;
export function groupClassList(classList: string, strategy: "MODIFIER" | "GROUP") {
  const { getClassGroupId, splitModifiers } = createConfigUtils(getDefaultConfig());

  // See: https://github.com/dcastil/tailwind-merge/blob/main/src/lib/merge-classlist.ts
  const groups = classList
    .trim()
    .split(SPLIT_CLASSES_REGEX)
    .map((originalClassName) => {
      const { modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } =
        splitModifiers(originalClassName);

      let classGroupId = getClassGroupId(
        maybePostfixModifierPosition ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName
      );
      let hasPostfixModifier = Boolean(maybePostfixModifierPosition);

      if (!classGroupId) {
        if (!maybePostfixModifierPosition) {
          return {
            isTailwindClass: false as const,
            originalClassName
          };
        }

        classGroupId = getClassGroupId(baseClassName);

        if (!classGroupId) {
          return {
            isTailwindClass: false as const,
            originalClassName
          };
        }

        hasPostfixModifier = false;
      }

      const variantModifier = sortModifiers(modifiers).join(":");
      const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;

      return {
        isTailwindClass: true as const,
        modifierId,
        classGroupId,
        originalClassName,
        hasPostfixModifier
      };
    })
    .reduce((groups, parsed) => {
      if (!parsed.isTailwindClass) {
        const group = groups.get(NON_TWD_CLASS_GROUP) || [];
        return groups.set(NON_TWD_CLASS_GROUP, [...group, parsed.originalClassName]);
      }
      const { modifierId, classGroupId, hasPostfixModifier } = parsed;
      const groupKey = strategy === "MODIFIER" ? modifierId : classGroupId;
      const group = groups.get(groupKey) || [];
      groups.set(groupKey, [...group, parsed.originalClassName]);
      return groups;
    }, new Map<string, string[]>());

  const nonTailwindClasses = groups.get(NON_TWD_CLASS_GROUP) || [];
  groups.delete(NON_TWD_CLASS_GROUP);
  return [...Array.from(groups.values()), nonTailwindClasses].filter((group) => group.length > 0);
}

const NON_TWD_CLASS_GROUP = "__NON_TWD_CLASS_GROUP";
