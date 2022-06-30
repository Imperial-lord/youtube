let values = {};

$('#qna-form').submit((e) => {
  // Show loading results
  $('#result').removeClass('visually-hidden');
  $('#message').html(
    '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"></div></div>',
  );

  e.preventDefault();
  const serializedArray = $('#qna-form').serializeArray();

  $.each(serializedArray, (index, field) => {
    values[field.name] = field.value;
  });

  console.log(values);

  // Send a GET request
  axios({
    method: 'get',
    url: `http://127.0.0.1:8000/answer/${values['context']}/${values['question']}`,
  }).then(
    (response) => {
      let answer = response.data['answer'];
      let score = response.data['score'];

      if ($('#result').hasClass('alert-success')) $('#result').removeClass('alert-success');
      if ($('#result').hasClass('alert-danger')) $('#result').removeClass('alert-danger');

      if (score > 1e-5) {
        $('#result').addClass('alert-success');
        $('#message').html(`${answer}`);
      } else {
        $('#result').addClass('alert-danger');
        $('#message').html(`The question is invalid. Please ask a different question`);
      }
    },
    (error) => {
      console.log(error);
    },
  );
});
