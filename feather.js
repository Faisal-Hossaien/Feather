// Feather JavaScript Template library v0.0.1
// (c) Muhammand Faisal Hossaien Talukder-> shamol@gmail.com
// License: MIT (http://www.opensource.org/licenses/mit-license.php)
var createTemplate = (function () {
    function skipSpaces(str, fromIndex) {
        while (str[fromIndex] == ' ' && fromIndex < str.length) fromIndex++;
        return fromIndex;
    }

    function isChar(str, index) {
        var charCode = str.charCodeAt(index);
        return (charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123);
    }

    function readWord(str, fromIndex) {
        var word = '';
        fromIndex = skipSpaces(str, fromIndex);
        while (str[fromIndex] != ' ' && isChar(str, fromIndex) && fromIndex < str.length) {
            word += str[fromIndex];
            fromIndex++;
        }
        return word;
    }

    function readBlock(str, index, blockStart, blockEnd) {
        var blockStr = '';
        var i = index + 2;
        var blockDepth = 0;
        while (i < str.length) {
            if (str[i] == blockEnd && blockDepth == 0) break;
            if (str[i] == blockStart) blockDepth++;
            if (str[i] == blockEnd) blockDepth--;
            blockStr += str[i];
            i++;
        }
        return {
            txt: blockStr,
            next: i + 1
        };
    }

    function readUpto(str, index, uptoChar) {
        var tmp = '';
        while (str[index] != uptoChar && index < str.length)
            if (str[index] != '') tmp += str[index++];
        return {
            txt: tmp,
            next: index + 1
        };
    }

    function readStatement(str, index) {
        var stmt = readWord(str, index + 1), data;
        if (stmt == '') {
            var d = readBlock(str, index, '{', '}');
            return {
                name: 'block',
                type: 'block',
                data: d,
                end: ''
            };
        }
        if (stmt == 'case' || stmt == 'default') {
            data = readUpto(str, index + 1, '{');
            return {
                name: 'case',
                data: data,
                end: ''
            };
        }
        if (stmt != 'for') {
            var i = index + 1;
            while (!(str[i] == ';' || str[i] == '{') && i < str.length) i++;
            if (str[i] == ';') {
                data = readUpto(str, index + 1, ';');
                data.txt += ';';
                return {
                    name: stmt,
                    type: 'block',
                    data: data,
                    end: ''
                };
            }
        }
        data = readUpto(str, index + 1, '{');
        data.txt += '{';
        return {
            name: stmt,
            data: data,
            end: '}'
        };
    }

    return function (tmplStr) {
        var i = 0, len = tmplStr.length, tmp = '', fnBody = '', stack = [], stmt;
        while (i < len) {
            if (tmplStr.indexOf('%{', i) == i) {
                tmp += '{';
                i += 2;
                continue;
            }
            if (tmplStr.indexOf('}%', i) == i) {
                tmp += '}';
                i += 2;
                continue;
            }
            if (tmplStr[i] == '@') {
                if (tmp.trim())
                    fnBody += '\np.push(\'' + tmp + '\');\n';
                stmt = readStatement(tmplStr, i);
                fnBody += stmt.data.txt;
                i = stmt.data.next;
                tmp = '';
                if (stmt.type != 'block')
                    stack.push(stmt);
                if (tmplStr[i] == '@') continue; 
            }
            if (tmplStr[i] == '}' && stack.length > 0) {
                stmt = stack.pop();
                if (tmp.trim())
                    fnBody += '\np.push(\'' + tmp + '\');\n';
                fnBody += stmt.end + '\n';
                tmp = '';
                i++;
                continue;
            }
            if (tmplStr[i] == '{') {
                var d = readUpto(tmplStr, i + 1, '}');
                if (d) {
                    tmp += '\'+' + d.txt + '+\'';
                    i = d.next;
                    continue;
                }
            }
            if (tmplStr[i] == '\'') tmp += "\\";
            tmp += tmplStr[i];
            i++;
        };
        if (tmp.trim())
            fnBody += '\np.push(\'' + tmp + '\');\n';
        return new Function("context", "var p=[];function $emit(str){p.push(str);};with(context){" + fnBody + "} \nreturn p.join('');");
    };
})();