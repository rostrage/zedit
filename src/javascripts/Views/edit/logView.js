ngapp.controller('logViewController', function($scope, contextMenuInterface, clipboardService) {
    // link view to scope
    $scope.view = $scope.$parent.tab;
    $scope.view.scope = $scope;
    $scope.startOffset = 0;

    // helper functions
    let buildMessageObj = msg => ({
        text: msg.trimRight(),
        class: getMessageClass(msg)
    });

    let onLogMessage = msg => {
        $scope.messages.push(buildMessageObj(msg));
    };

    let getMessageClass = msg => {
        let n = msg[0] === '[' && msg.indexOf(']');
        if (n <= 0) return 'log';
        return `${msg.slice(1, n).toLowerCase()}`;
    };

    // scope functions
    $scope.loadMessages = function() {
        $scope.messages = logger.getMessages()
            .slice($scope.startOffset)
            .map(buildMessageObj);
    };

    $scope.copyLog = function() {
        let text = $scope.messages.reduce((text, msg) => text + msg.text, '');
        clipboardService.copyText(text);
    };

    $scope.clearLog = function() {
        $scope.startOffset += $scope.messages.length;
        $scope.messages = [];
    };

    // initialization
    $scope.loadMessages();
    contextMenuInterface($scope, 'logView');

    // event handlers
    logger.addCallback('log', onLogMessage);

    $scope.$on('destroy', function() {
        logger.removeCallback('log', onLogMessage);
    });
});
