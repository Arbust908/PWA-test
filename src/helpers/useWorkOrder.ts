export const validateEquipment = (
    cradleId: number,
    cradleIdBackup: number,
    forkliftId: number,
    forkliftIdBackup: number,
    traktors: Array<any>,
    pickups: Array<any>
) => {
    return !!(
        cradleId > -1 &&
        cradleIdBackup > -1 &&
        forkliftId > -1 &&
        forkliftIdBackup > -1 &&
        traktors.length > 0 &&
        traktors.every((traktor) => traktor.chassis !== '' && traktor.supplier !== '') &&
        pickups.length > 0 &&
        pickups.every((pickup) => pickup.pickupId !== '')
    );
};

export const validateOrder = (clientId: number, companyId: number, pad: string, pits: Array<string>) => {
    return !!(clientId > -1 && companyId > -1 && pad !== '' && pits.length > 0 && pits.every((pit) => pit !== ''));
};
