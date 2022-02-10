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
        forkliftId > -1 &&
        traktors.length > 0 &&
        traktors.every((traktor) => traktor.chassis !== -1 && traktor.supplier !== -1) &&
        pickups.length > 0 &&
        pickups.every((pickup) => pickup.pickupId !== '')
    );
};

export const validateOrder = (clientId: number, pad: string, pits: Array<any>) => {
    return !!(clientId > -1 && pad !== '' && pits.length > 0 && pits.every((pit) => pit.name !== ''));
};

export const validateHumanResourses = (crews: Array<any>) => {
    return !!(
        crews &&
        crews.length > 0 &&
        crews.every((group: Crew) => {
            const resourcesFull =
                group.resources.length > 0 &&
                group.resources.every((resource: HumanResource) => {
                    return resource.role != -1 && resource.name != -1;
                });

            return group.timeStart && group.timeEnd && resourcesFull;
        })
    );
};
