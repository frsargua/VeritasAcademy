// async function createNewProperty() {
//   const newPropertyForm = document.getElementById('newProperty');
//   newPropertyForm.addEventListener('click', async (e) => {
//     e.preventDefault();

//     const newPropertyFormFields = new FormData(newPropertyForm);
//     const formProps = Object.fromEntries(newPropertyFormFields);
//     let propertyAvailability = $('#flexSwitchCheckChecked')
//       .prop('checked')
//       .prop('value', true);
//     formProps.available = propertyAvailability;

//     console.log(formProps);

//     // const response = await fetch('/api/property/', {
//     //   method: 'POST',
//     //   body: JSON.stringify(formProps),
//     //   headers: { 'Content-Type': 'application/json' },
//     // });
//     // if (response.ok) {
//     //   window.location.href = '/';
//     // }
//   });
// }
