/**
 * Form message
 *
 * @returns {JSX.Element}
 * @constructor
 */
const FormMessage = () => {
  return (
    <>
      <form
        className="unibeform"
        name="u5form"
        action="formsave.php?n=formular&amp;l=en"
        method="post"
        target="fvifr"
      >
        <br />
        <br />
        <fieldset className="p-6">
          <legend>Your data</legend>

          {/*Hidden fields in your form. You should have them in your form */}
          <input
            type="hidden"
            name="ouremail"
            value="enter@youremailaddress.here"
          />
          <input type="hidden" name="thanks" value="thanks" />
          <input
            type="hidden"
            name="thankssubject"
            value="Thank you for your message!"
          />
          <input
            type="hidden"
            name="thankstext"
            value="Thank you for your message! Please find it quoted below:"
          />
          <input
            type="hidden"
            name="thanksgreetings"
            value="Yours faithfully, John Smith"
          />

          {/*Visible fields in your form displayed to the form user*/}
          <label>Business*</label>
          <select name="business_mandatory" className="py-2">
            <option value="">please select</option>
            <option value="education">Education</option>
            <option value="engineering">Engineering</option>
            <option value="medical">Medical</option>
            <option value="other">other</option>
          </select>

          <label>Name*</label>
          <input type="text" name="name_mandatory" placeholder="Name" />

          <label>Firstname</label>
          <input type="text" name="firstname" />

          <label>E-Mail*</label>
          <input type="text" name="youremail_mandatory" />

          <label>Message*</label>
          <textarea
            rows="3"
            className="w-[98%]"
            type="text"
            name="message_mandatory"
          ></textarea>

          <label>
            How much is hundred minus one (enter digits)?{' '}
            <a
              title="javascript:alert('Spam robots fill in web-forms automatically. This question disables spam robots.');"
              href="javascript:alert('Spam robots fill in web-forms automatically. This question disables spam robots.');"
            >
              Why
              <nobr>?</nobr>
            </a>
          </label>
          <input type="text" name="cliving_mandatory" />

          <label>&nbsp;</label>
          <input type="submit" value="send" />

          <br />
        </fieldset>
        <br />
      </form>
    </>
  );
};

export default FormMessage;
