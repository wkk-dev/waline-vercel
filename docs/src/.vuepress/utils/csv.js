var CSV = {};
!(function (p) {
  'use strict';
  p.__type__ = 'csv';
  var o =
    ('undefined' != typeof jQuery && jQuery.Deferred) ||
    ('undefined' != typeof _ && _.Deferred) ||
    function () {
      var t,
        n,
        e = new Promise(function (e, r) {
          ((t = e), (n = r));
        });
      return {
        resolve: t,
        reject: n,
        promise: function () {
          return e;
        },
      };
    };
  ((p.fetch = function (t) {
    var n = new o();
    if (t.file) {
      var e = new FileReader(),
        r = t.encoding || 'UTF-8';
      ((e.onload = function (e) {
        var r = p.extractFields(p.parse(e.target.result, t), t);
        ((r.useMemoryStore = !0),
          (r.metadata = { filename: t.file.name }),
          n.resolve(r));
      }),
        (e.onerror = function (e) {
          n.reject({
            error: {
              message: 'Failed to load file. Code: ' + e.target.error.code,
            },
          });
        }),
        e.readAsText(t.file, r));
    } else if (t.data) {
      var i = p.extractFields(p.parse(t.data, t), t);
      ((i.useMemoryStore = !0), n.resolve(i));
    } else if (t.url) {
      (
        window.fetch ||
        function (e) {
          var r = jQuery.get(e),
            t = {
              then: function (e) {
                return (r.done(e), t);
              },
              catch: function (e) {
                return (r.fail(e), t);
              },
            };
          return t;
        }
      )(t.url)
        .then(function (e) {
          return e.text ? e.text() : e;
        })
        .then(function (e) {
          var r = p.extractFields(p.parse(e, t), t);
          ((r.useMemoryStore = !0), n.resolve(r));
        })
        .catch(function (e, r) {
          n.reject({
            error: {
              message:
                'Failed to load file. ' + e.statusText + '. Code: ' + e.status,
              request: e,
            },
          });
        });
    }
    return n.promise();
  }),
    (p.extractFields = function (e, r) {
      return !0 !== r.noHeaderRow && 0 < e.length
        ? { fields: e[0], records: e.slice(1) }
        : { records: e };
    }),
    (p.normalizeDialectOptions = function (e) {
      var r = {
        delimiter: ',',
        doublequote: !0,
        lineterminator: '\n',
        quotechar: '"',
        skipinitialspace: !0,
        skipinitialrows: 0,
      };
      for (var t in e)
        'trim' === t
          ? (r.skipinitialspace = e.trim)
          : (r[t.toLowerCase()] = e[t]);
      return r;
    }),
    (p.parse = function (e, r) {
      (r && (!r || r.lineterminator)) || (e = p.normalizeLineTerminator(e, r));
      var t,
        n,
        i = p.normalizeDialectOptions(r);
      ((t = e),
        (n = i.lineterminator),
        (e =
          t.charAt(t.length - n.length) !== n
            ? t
            : t.substring(0, t.length - n.length)));
      var o,
        a,
        l = '',
        s = !1,
        u = !1,
        c = '',
        f = [],
        d = [];
      for (
        a = function (e) {
          return (
            !0 !== u &&
              ('' === e ? (e = null) : !0 === i.skipinitialspace && (e = v(e)),
              h.test(e)
                ? (e = parseInt(e, 10))
                : m.test(e) && (e = parseFloat(e, 10))),
            e
          );
        },
          o = 0;
        o < e.length;
        o += 1
      )
        ((l = e.charAt(o)),
          !1 !== s || (l !== i.delimiter && l !== i.lineterminator)
            ? l !== i.quotechar
              ? (c += l)
              : s
                ? e.charAt(o + 1) === i.quotechar
                  ? ((c += i.quotechar), (o += 1))
                  : (s = !1)
                : (u = s = !0)
            : ((c = a(c)),
              f.push(c),
              l === i.lineterminator && (d.push(f), (f = [])),
              (c = ''),
              (u = !1)));
      return (
        (c = a(c)),
        f.push(c),
        d.push(f),
        i.skipinitialrows && (d = d.slice(i.skipinitialrows)),
        d
      );
    }),
    (p.normalizeLineTerminator = function (e, r) {
      return (r = r || {}).lineterminator
        ? e
        : e.replace(/(\r\n|\n|\r)/gm, '\n');
    }),
    (p.objectToArray = function (e) {
      for (var r = [], t = [], n = [], i = 0; i < e.fields.length; i++) {
        var o = e.fields[i].id;
        n.push(o);
        var a = e.fields[i].label ? e.fields[i].label : o;
        t.push(a);
      }
      r.push(t);
      for (i = 0; i < e.records.length; i++) {
        for (var l = [], s = e.records[i], u = 0; u < n.length; u++)
          l.push(s[n[u]]);
        r.push(l);
      }
      return r;
    }),
    (p.serialize = function (e, r) {
      var t = null;
      t = e instanceof Array ? e : p.objectToArray(e);
      var n,
        i,
        o,
        a = p.normalizeDialectOptions(r),
        l = '',
        s = '',
        u = '',
        c = '';
      for (
        o = function (e) {
          return (
            null === e
              ? (e = '')
              : 'string' == typeof e && f.test(e)
                ? (a.doublequote && (e = e.replace(/"/g, '""')),
                  (e = a.quotechar + e + a.quotechar))
                : 'number' == typeof e && (e = e.toString(10)),
            e
          );
        },
          n = 0;
        n < t.length;
        n += 1
      )
        for (l = t[n], i = 0; i < l.length; i += 1)
          ((s = o(l[i])),
            i === l.length - 1
              ? ((c += (u += s) + a.lineterminator), (u = ''))
              : (u += s + a.delimiter),
            (s = ''));
      return c;
    }));
  var h = /^\d+$/,
    m = /^\d*\.\d+$|^\d+\.\d*$/,
    f = /^\s|\s$|,|"|\n/,
    v = String.prototype.trim
      ? function (e) {
          return e.trim();
        }
      : function (e) {
          return e.replace(/^\s*/, '').replace(/\s*$/, '');
        };
})(CSV);

export default CSV;
