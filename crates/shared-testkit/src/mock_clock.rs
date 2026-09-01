use application::ports::Clock;
use chrono::{DateTime, TimeZone, Utc};
use std::sync::RwLock;

pub struct MockClock {
    current_time: RwLock<DateTime<Utc>>,
}

impl MockClock {
    pub fn new(initial: DateTime<Utc>) -> Self {
        Self {
            current_time: RwLock::new(initial),
        }
    }

    pub fn set(&self, time: DateTime<Utc>) {
        if let Ok(mut lock) = self.current_time.write() {
            *lock = time;
        }
    }
}

impl Default for MockClock {
    fn default() -> Self {
        Self::new(Utc.with_ymd_and_hms(2026, 9, 1, 12, 0, 0).unwrap())
    }
}

impl Clock for MockClock {
    fn now(&self) -> DateTime<Utc> {
        *self.current_time.read().unwrap()
    }
}
