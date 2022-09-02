The following are major bugs or quirks which are known to exist:

* If you ask for include=a.b.c,e.f where `b` and `e` are the same type of object
  (or even the exact same object), the behaviour is undefined, and in practice
  you'll just get one or the other.