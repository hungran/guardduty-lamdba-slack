exports.handler = async(event) => {
    var Slack = require('slack-node');
    var slack = new Slack();
    var webhookUri = process.env.SLACK_HOOK ? process.env.SLACK_HOOK : "https://hooks.slack.com/services/ZZZZZZZZ/XXXXXXXX/YYYYYYY";
    slack.setWebhook(webhookUri);

    console.log(event.region);
    console.log(event.detail.severity);
    console.log(event.detail.service.additionalInfo);

    var readbleLasteSeen = getTimeDiffAndPrettyText(new Date(event.detail.service.eventLastSeen));

    var text = "*Event of Severity* -" + event.detail.severity +
        "\n *Region* - " + event.region +
        "\n *Details* - " + JSON.stringify(event.detail.service.additionalInfo) +
        "\n *Resource Type* - " + event.detail.resource.resourceType +
        "\n *Event Last Seen* - " + readbleLasteSeen.friendlyNiceText;


    var color = "#0073bb";

    switch (true) {
        case (event.detail.severity <= 3.9 && event.detail.severity >= 0):
            color = "#0073bb";
            break;
        case (event.detail.severity <= 6.9 && event.detail.severity >= 4):
            color = "#eb5f07";
            break;
        case (event.detail.severity <= 8.9 && event.detail.severity >= 7):
            color = "#d13212";
            break;
    }
    var message = {
        "fallback": "Guard Duty Alert",
        "color": color,
        "title": `Summary of Alert`,
        "title_link": 'https://ap-southeast-1.console.aws.amazon.com/guardduty',
        "text": text,
        "footer": "GuardDuty",
        "ts": toTimestamp(new Date())
    };



    //Repalce the name of your Slack Channel here.
    var yourChannelName = "#GuardDuty"

    slack.webhook({
        channel: team,
        username: "Guard Duty - Thit Kho Tau",
        text: "*Report of Fraud Events.*",
        attachments: [message]
    }, function(err, response) {
        if (err) { throw err; }
        return response;
    });

    function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum / 1000;
    }


    function getTimeDiffAndPrettyText(oDatePublished) {

        var oResult = {};

        var oToday = new Date();

        var nDiff = oToday.getTime() - oDatePublished.getTime();

        // Get diff in days
        oResult.days = Math.floor(nDiff / 1000 / 60 / 60 / 24);
        nDiff -= oResult.days * 1000 * 60 * 60 * 24;

        // Get diff in hours
        oResult.hours = Math.floor(nDiff / 1000 / 60 / 60);
        nDiff -= oResult.hours * 1000 * 60 * 60;

        // Get diff in minutes
        oResult.minutes = Math.floor(nDiff / 1000 / 60);
        nDiff -= oResult.minutes * 1000 * 60;

        // Get diff in seconds
        oResult.seconds = Math.floor(nDiff / 1000);

        // Render the diffs into friendly duration string

        // Days
        var sDays = '00';
        if (oResult.days > 0) {
            sDays = String(oResult.days);
        }
        if (sDays.length === 1) {
            sDays = '0' + sDays;
        }

        // Format Hours
        var sHour = '00';
        if (oResult.hours > 0) {
            sHour = String(oResult.hours);
        }
        if (sHour.length === 1) {
            sHour = '0' + sHour;
        }

        //  Format Minutes
        var sMins = '00';
        if (oResult.minutes > 0) {
            sMins = String(oResult.minutes);
        }
        if (sMins.length === 1) {
            sMins = '0' + sMins;
        }

        //  Format Seconds
        var sSecs = '00';
        if (oResult.seconds > 0) {
            sSecs = String(oResult.seconds);
        }
        if (sSecs.length === 1) {
            sSecs = '0' + sSecs;
        }

        //  Set Duration
        var sDuration = sDays + ':' + sHour + ':' + sMins + ':' + sSecs;
        oResult.duration = sDuration;

        // Set friendly text for printing
        if (oResult.days === 0) {

            if (oResult.hours === 0) {

                if (oResult.minutes === 0) {
                    var sSecHolder = oResult.seconds > 1 ? 'Seconds' : 'Second';
                    oResult.friendlyNiceText = oResult.seconds + ' ' + sSecHolder + ' ago';
                } else {
                    var sMinutesHolder = oResult.minutes > 1 ? 'Minutes' : 'Minute';
                    oResult.friendlyNiceText = oResult.minutes + ' ' + sMinutesHolder + ' ago';
                }

            } else {
                var sHourHolder = oResult.hours > 1 ? 'Hours' : 'Hour';
                oResult.friendlyNiceText = oResult.hours + ' ' + sHourHolder + ' ago';
            }
        } else {
            var sDayHolder = oResult.days > 1 ? 'Days' : 'Day';
            oResult.friendlyNiceText = oResult.days + ' ' + sDayHolder + ' ago';
        }

        return oResult;
    }
};