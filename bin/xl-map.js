#!/usr/bin/env node

const child_process = require('child_process')
var path = require('path');
var argv = require('yargs').argv
var program = require('commander')
var chalk = require('chalk')
var shell = require('shelljs')
const {exec} = require('shelljs')
const sourceMap = require("source-map");
const fs = require('fs');


// 如果存在本地的命令，执行本地的
try {
    var localWebpack = require.resolve(path.join(process.cwd(), "node_modules", "xl-close_port", "bin", "xl-close_port.js"));
    if (__filename !== localWebpack) {
        return require(localWebpack);
    }
} catch (e) {
}


let package = JSON.parse(shell.cat(path.join(__dirname, '../package.json')))

let dirName = process.cwd()
program
    .version(package.version)
    .usage('<file> [options]')
    .option('file', '文件名称 ./[file].js.map 或者 path')
    .option('-l', 'line 号')
    .option('-c', 'column 号')
    .action((file) => {
        var pathMap = /\.js\.map$/.test(file) ? file : `./${file}.js.map`
        var rawSourceMap = fs.readFileSync(pathMap).toString();
        let smc = new sourceMap.SourceMapConsumer(rawSourceMap);
        smc.then((rst) => {
            let originPos = rst.originalPositionFor({
                line: argv.l || 1,
                column: argv.c || 1
            });
            console.log(originPos)
        })
    })


program.parse(process.argv)
