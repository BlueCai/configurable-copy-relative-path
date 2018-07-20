var vscode = require('vscode');
var copy = require('copy-paste').copy;
var _ = require('lodash')

function activate(context) {
    var copyRelativePathConfigedDisposable = vscode.commands.registerCommand('copyRelativePathConfiged', function (uri) {
        var path = getRelativePath(uri)
        // "src/components/common/assemblies/ads-overlay"
        path = workWithConfig(path)
        copy(path);
    });

    var copyRelativePathDisposable = vscode.commands.registerCommand('copyRelativePath', function (uri) {
        var path = getRelativePath(uri)
        copy(path);
    });
    context.subscriptions.push(copyRelativePathConfigedDisposable);
    context.subscriptions.push(copyRelativePathDisposable);
}

function getRelativePath(uri){
    if (typeof uri === 'undefined') {
        if (vscode.window.activeTextEditor) {
            uri = vscode.window.activeTextEditor.document.uri;
        }
    }
    if (!uri) {
        vscode.window.showErrorMessage('Cannot copy relative path, as there appears no file is opened (or it is very large');
        return;
    }
    var path = vscode.workspace.asRelativePath(uri);
    path = path.replace(/\\/g, '/');
    return path
}

function getConfig() {
    var trimStart = vscode.workspace.getConfiguration('copyRelativePath').get('trimStart')
    var trimEnd = vscode.workspace.getConfiguration('copyRelativePath').get('trimEnd')
    return {
        trimStart: trimStart,
        trimEnd: trimEnd
    }
}

function workWithConfig(path) {
    var config = getConfig()
    if (config.trimStart) {
        var trimStartArray = config.trimStart.split(';')
        trimStartArray.forEach(element => {
            path = _.trimStart(path, element)
        })
    }

    if (config.trimEnd) {
        var trimEndArray = config.trimEnd.split(';')
        trimEndArray.forEach(element => {
            path = _.trimEnd(path, element)
        });
    }

    return path
}

exports.activate = activate;


function deactivate() {
}
exports.deactivate = deactivate;