const {
    createHash
} = require("crypto");
const {
    random
} = require("./helpers");
const {
    verify
} = require("./encryption");
const axios = require("axios");
const crypto = require("crypto");
const ip = require("ip");
const os = require("os");
const schedule = require("node-schedule");
const {
    format
} = require("date-fns");
module.exports = {
    renewProLicence(e, t) {
        this.adapter.log.debug("Pro: Renew licence...");
        const i = {
            ...t,
            action: "getInvoicesBySubscriptionId",
            email: e.subscriber.email_address,
            subscriptionId: e.subscriptionId
        };
        return axios.post("https://www.zefau.net/jarvis/user/invoice.php", i).then(e => {
            const t = e.data;
            const i = t.pop();
            const r = i.expires * 1e3;
            if (i.token && r > Date.now()) {
                this.adapter.setState("info.pro", JSON.stringify(i.token, null, 3), true);
                this.adapter.log.debug("Pro: Renewed licence. New expiration is " + format(i.token.expires, "EEE, dd. MMM yyyy") + ".")
            }
        }).catch(e => {
            this.adapter.log.warn("Pro: Failed renewing licence: " + e.message);
            return e.message
        })
    },
function verifyProLicence() {
    return Promise.resolve();
};
    pro() {
        this.verifyProLicence().catch(e => {});
        if (this.adapter.config.scheduledHour === undefined || this.adapter.config.scheduledMinute === undefined) {
            this.adapter.getForeignObject("system.adapter." + this.adapter.namespace, (e, t) => {
                if (e || !t || !t.native) {
                    return false
                }
                const i = random(0, 59);
                const r = random(0, 23);
                t.native = {
                    ...t.native,
                    scheduledHour: r,
                    scheduledMinute: i
                };
                this.adapter.setForeignObject(t._id, t)
            })
        } else {
            this.adapter.log.debug("Scheduled for " + this.adapter.config.scheduledHour + ":" + this.adapter.config.scheduledMinute + ".");
            this.schedulers.verifyProLicence = schedule.scheduleJob(this.adapter.config.scheduledMinute + " " + this.adapter.config.scheduledHour + " * * *", () => this.verifyProLicence().catch(e => {}))
        }
    }
};
