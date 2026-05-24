import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.LinkedHashMap;

public class TestEncode {
    private static final String CHECKLIST_MARKER = "\n__SAFEFOOD_CHECKLIST__=";
    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();

    public static void main(String[] args) {
        Map<String, String> checklist = new LinkedHashMap<>();
        checklist.put("cleanProcessingArea", "pass");
        checklist.put("separateRawCookedArea", "fail");
        
        System.out.println(encodeGeneralComment("không đạt yêu cầu", checklist));
    }

    private static String encodeGeneralComment(String generalComment, Map<String, String> checklist) {
        String cleanedComment = generalComment == null ? "" : generalComment.trim();
        if (checklist == null || checklist.isEmpty()) {
            return cleanedComment;
        }

        try {
            String checklistJson = JSON_MAPPER.writeValueAsString(checklist);
            return cleanedComment + CHECKLIST_MARKER + checklistJson;
        } catch (JsonProcessingException e) {
            return cleanedComment;
        }
    }
}
