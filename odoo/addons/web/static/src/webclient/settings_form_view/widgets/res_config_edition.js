/** @odoo-module */

import { registry } from "@web/core/registry";
import { session } from "@web/session";
import { Setting } from "@web/views/form/setting/setting";

import { Component } from "@odoo/owl";
import { standardWidgetProps } from "@web/views/widgets/standard_widget_props";
const { DateTime } = luxon;

/**
 * Widget in the settings that handles a part of the "About" section.
 * Contains info about the odoo version, database expiration date and copyrights.
 */
class ResConfigEdition extends Component {
    static template = "res_config_edition";
    static components = { Setting };
    static props = {
        ...standardWidgetProps,
    };

    setup() {
        this.serverVersion = session.server_version;
        // Controlla se la sessione ha una data di scadenza, altrimenti usa "October 4, 2035"
        this.expirationDate = session.expiration_date
            ? DateTime.fromSQL(session.expiration_date).toLocaleString(DateTime.DATE_FULL)
            : DateTime.fromISO("2035-10-04").toLocaleString(DateTime.DATE_FULL);
    }
}

export const resConfigEdition = {
    component: ResConfigEdition,
};

registry.category("view_widgets").add("res_config_edition", resConfigEdition);
