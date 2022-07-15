import { AttributeEnum } from "../enums";

export const getDefaultAttributeValue = (attributeId: number): number => {
    switch (attributeId) {
        case AttributeEnum.HP:
            return 50;
        case AttributeEnum.Strength:
            return 15;
        case AttributeEnum.Defense:
            return 5;
        case AttributeEnum.CriticalChance:
            return 0;
        case AttributeEnum.CriticalDamage:
            return 0;
        default:
            return -1;
    }
};
