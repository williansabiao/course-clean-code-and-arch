import EnrollStudent from './EnrollStudent';

test('should not enroll without valid student name', function () {
  const enrollStudent = new EnrollStudent();
  const enrollmentRequest = {
    student: {
      name: 'Ana',
      cpf: '',
    }
  };
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid name'))
});

test('should not enroll without valid student cpf', function () {
  const enrollStudent = new EnrollStudent();
  const enrollmentRequest = {
    student: {
      name: "Ana Silva",
      cpf: "123.456.789-99"
    }
  }
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Invalid cpf'))
});

test('Should not enroll duplicated student', function () {
  const enrollStudent = new EnrollStudent();
  const enrollmentRequest = {
    student: {
      name: "Ana Silva",
      cpf: "832.081.519-34"
    }
  }
  enrollStudent.execute(enrollmentRequest)
  expect(() => enrollStudent.execute(enrollmentRequest)).toThrow(new Error('Enrollment with duplicated student is not allowed'))
});

test('Should enroll 2 student and return them', function () {
  const enrollStudent = new EnrollStudent();
  const enrollmentRequest1 = {
    student: {
      name: "Ana Silva",
      cpf: "832.081.519-34"
    }
  }
  const enrollmentRequest2 = {
    student: {
      name: "Joseph Silva",
      cpf: "537.891.090-02"
    }
  }
  enrollStudent.execute(enrollmentRequest1)
  expect(enrollStudent.execute(enrollmentRequest2)).toHaveLength(2)
});