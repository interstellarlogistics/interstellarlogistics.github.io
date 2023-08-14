async function getClipboardPermission() {

    const queryOpts = { name: 'clipboard-write', allowWithoutGesture: false };
    const permissionStatus = await navigator.permissions.query(queryOpts);
    console.log("permissionStatus.state: " + permissionStatus.state);

    // Listen for changes to the permission state
    permissionStatus.onchange = () => {
        console.log("permissionStatus.state: " + permissionStatus.state);
    };

}

function calculator() {

    //radio button
    let iskperm3;
    const radioButtons = document.querySelectorAll('input[name="route"]');

    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            iskperm3 = radioButton.value;
            break;
        }
    }

    //calculate
    var volume = AutoNumeric.getNumber('#volume');
    var collateral = AutoNumeric.getNumber('#collateral');
    var reward = Math.max(volume * iskperm3 + collateral * 0.01, 5000000);

    //set
    $('#reward').html(AutoNumeric.format(reward, { currencySymbol: ' ISK', currencySymbolPlacement: 's',  decimalPlaces: 2 }));

}

function fallbackCopyTextToClipboard(text,confirmationDivID) {
    
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
        $("#" + confirmationDivID).html("Copied!");
        $("#" + confirmationDivID)[0].style.display = "inline-block";
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
    
}
    
function copyTextToClipboard(divID,confirmationDivID) {

    getClipboardPermission();

    $("#" + confirmationDivID)[0].style.display = "none";
    if($("#" + divID).is("input")) {
        text = $("#" + divID).val() + " ISK";
    } else {
        text = $("#" + divID).html();
    }
    
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text,confirmationDivID);
        return;
    }
    
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
        $("#" + confirmationDivID).html("Copied!");
        $("#" + confirmationDivID)[0].style.display = "inline-block";
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
    
}

$(function() {
    
    $('radio, input').on('change', calculator);
    
    new AutoNumeric('#volume', { minimumValue: 0, maximumValue: 370000, dotDecimalCharCommaSeparator:true, floatPos:true });
    new AutoNumeric('#collateral', { minimumValue: 0, maximumValue: 50000000000, dotDecimalCharCommaSeparator:true, floatPos:true });
    
});