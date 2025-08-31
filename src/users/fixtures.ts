export const userData = {
  name: "Test",
  email: "test@test",
  password: "test123",
  age: 32
};

export const userData2 = {
  name: "Test2",
  email: "test@test2",
  password: "test123",
  age: 30
};

export const updatedUserData = {
  name: "Test",
  email: "test@test",
  password: "test123",
  age: 25
};

export const userDataWithMissingName = {
  email: "test@test",
  password: "test123",
  age: 32
};

export const wrongEmailLogin = {
  email: "wrong@email",
  password: "test123"
};

export const wrongPasswordLogin = {
  email: "test@test",
  password: "wrongPassword"
};

// Fixtures for schedule testing
export const userWithFixedSchedules = {
  name: "Test",
  email: "test@test",
  password: "test123",
  age: 32,
  fixed_schedules: [
    {
      id: "schedule1",
      hour_of_the_day: "10:00",
      week_day: "MONDAY"
    },
    {
      id: "schedule2", 
      hour_of_the_day: "14:00",
      week_day: "WEDNESDAY"
    }
  ],
  variable_schedules: [],
  canceled_schedules: []
};

export const userWithVariableSchedules = {
  name: "Test2",
  email: "test2@test.com",
  password: "test123",
  age: 30,
  fixed_schedules: [],
  variable_schedules: [
    {
      id: "var1",
      hour_of_the_day: "16:00",
      day: "2024-01-20"
    },
    {
      id: "var2",
      hour_of_the_day: "18:00", 
      day: "2024-01-25"
    }
  ],
  canceled_schedules: []
};

export const userWithMixedSchedules = {
  name: "Test3",
  email: "test3@test.com",
  password: "test123",
  age: 28,
  fixed_schedules: [
    {
      id: "fixed1",
      hour_of_the_day: "09:00",
      week_day: "FRIDAY"
    }
  ],
  variable_schedules: [
    {
      id: "var1",
      hour_of_the_day: "15:00",
      day: "2024-01-22"
    }
  ],
  canceled_schedules: [
    {
      id: "canceled1",
      hour_of_the_day: "11:00",
      day: "2024-01-18"
    }
  ]
};

export const userWithNoSchedules = {
  name: "Test4",
  email: "test4@test.com",
  password: "test123",
  age: 35,
  fixed_schedules: [],
  variable_schedules: [],
  canceled_schedules: []
};
