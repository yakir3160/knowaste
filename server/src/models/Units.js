export const MassUnit = {
    KILOGRAM: 'kg',
    GRAM: 'g',
    MILLIGRAM: 'mg'
};

export const VolumeUnit = {
    LITER: 'l',
    MILLILITER: 'ml',
    CENTILITER: 'cl'
};

export const CountUnit = {
    UNIT: 'unit',
    PIECE: 'piece',
    BOX: 'box',
    PACKAGE: 'package'
};

export const allUnits = [
    ...Object.values(MassUnit),
    ...Object.values(VolumeUnit),
    ...Object.values(CountUnit)
];

