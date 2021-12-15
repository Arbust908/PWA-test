import { Ability, AbilityBuilder } from '@casl/ability';

class PermissionsManager {
    permissions: any[] = [];
    ability_instance: any = null;

    constructor(permissions: string[] = []) {
        this.permissions = permissions;

        if (Array.isArray(this.permissions)) {
            this.ability_instance = new Ability(this.permissions);
        }
    }

    getInstance() {
        return this.ability_instance;
    }

    setPermissions(permissions = []) {
        const { can, rules } = new AbilityBuilder(Ability);

        if (Array.isArray(permissions)) {
            this.permissions = permissions;

            permissions.forEach((permission) => {
                const [obj]: [string, string][] = Object.entries(permission);

                [obj[1]].forEach((p) => {
                    can(obj[0], p);
                });
            });

            this.ability_instance.update(rules);
        } else {
            return false;
        }
    }

    canI(action: string, subject: string) {
        return this.getInstance().can(action, subject);
    }
}

export default new PermissionsManager();
